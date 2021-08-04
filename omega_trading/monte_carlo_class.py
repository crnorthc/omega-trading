# -*- coding:utf-8 -*-
#######################################################################
# Copyright (C) 2016 Shijie Huang (harveyh@student.unimelb.edu.au)    #
# Permission given to modify the code as long as you keep this        #
# declaration at the top                                              #
#######################################################################

import numpy as np
from typing import Tuple


class MonteCarloOptionPricing:
    def __init__(self, r, S0: float, K: float, T: float, mue: float, sigma: float, div_yield: float = 0.0,
                 simulation_rounds: int = 10000, no_of_slices: int = 4, fix_random_seed: bool or int = False):
        """
        An important reminder, here the models rely on the assumption of constant interest rate and volatility.
        :param S0: current price of the underlying asset (e.g. stock)
        :param K: exercise price
        :param T: time to maturity, in years, can be float
        :param r: interest rate, by default we assume constant interest rate model
        :param sigma: volatility (in standard deviation) of the asset annual returns
        :param div_yield: annual dividend yield
        :param simulation_rounds: in general, monte carlo option pricing requires many simulations
        :param no_of_slices: between time 0 and time T, the number of slices PER YEAR, e.g. 252 if trading days are required
        :param fix_random_seed: boolean or integer
        """
        assert sigma >= 0, 'volatility cannot be less than zero'
        assert S0 >= 0, 'initial stock price cannot be less than zero'
        assert T >= 0, 'time to maturity cannot be less than zero'
        assert div_yield >= 0, 'dividend yield cannot be less than zero'
        assert no_of_slices >= 0, 'no of slices per year cannot be less than zero'
        assert simulation_rounds >= 0, 'simulation rounds cannot be less than zero'

        self.S0 = float(S0)
        self.K = float(K)
        self.T = float(T)
        self.mue = float(mue)
        self.div_yield = float(div_yield)

        self.no_of_slices = int(no_of_slices)
        self.simulation_rounds = int(simulation_rounds)

        self.h = self.T / self.no_of_slices

        self.r = np.full((self.simulation_rounds, self.no_of_slices), r * self.h)
        self.discount_table = np.exp(np.cumsum(-self.r, axis=1))

        self.sigma = np.full((self.simulation_rounds, self.no_of_slices), sigma)

        self.terminal_prices = []

        if type(fix_random_seed) is bool:
            if fix_random_seed:
                np.random.seed(15000)
        elif type(fix_random_seed) is int:
            np.random.seed(fix_random_seed)


    def american_option_longstaff_schwartz(self, poly_degree: int = 2, option_type: str = 'call') -> \
            Tuple[float, float]:
        """
        American option, Longstaff and Schwartz method
        :param poly_degree: x^n, default = 2
        :param option_type: call or put
        """
        assert option_type == 'call' or option_type == 'put', 'option_type must be either call or put'
        assert len(self.terminal_prices) != 0, 'Please simulate the stock price first'

        if option_type == 'call':
            self.intrinsic_val = np.maximum((self.price_array - self.K), 0.0)
        elif option_type == 'put':
            self.intrinsic_val = np.maximum((self.K - self.price_array), 0.0)

        # last day cashflow == last day intrinsic value
        cf = self.intrinsic_val[:, -1]

        stopping_rule = np.zeros_like(self.price_array)
        stopping_rule[:, -1] = np.where(self.intrinsic_val[:, -1] > 0, 1, 0)

        # Longstaff and Schwartz iteration
        for t in range(self.no_of_slices - 2, 0, -1):  # fill out the value table from backwards
            # find out in-the-money path to better estimate the conditional expectation function
            # where exercise is relevant and significantly improves the efficiency of the algorithm
            itm_path = np.where(self.intrinsic_val[:, t] > 0)  # <==> self.price_array[:, t] vs. self.K

            cf = cf * np.exp(-self.r[:, t + 1])
            Y = cf[itm_path]
            X = self.price_array[itm_path, t]

            # initialize continuation value
            hold_val = np.zeros(shape=self.simulation_rounds)
            # if there is only 5 in-the-money paths (most likely appear in out-of-the-money options
            # then simply assume that value of holding = 0.
            # otherwise, run regression and compute conditional expectation E[Y|X].
            if len(itm_path) > 5:
                rg = np.polyfit(x=X[0], y=Y, deg=poly_degree)  # regression fitting
                hold_val[itm_path] = np.polyval(p=rg, x=X[0])  # conditional expectation E[Y|X]

            # 1 <==> exercise, 0 <==> hold
            stopping_rule[:, t] = np.where(self.intrinsic_val[:, t] > hold_val, 1, 0)
            # if exercise @ t, all future stopping rules = 0 as the option contract is exercised.
            stopping_rule[np.where(self.intrinsic_val[:, t] > hold_val), (t + 1):] = 0

            # cashflow @ t, if hold, cf = 0, if exercise, cf = intrinsic value @ t.
            cf = np.where(self.intrinsic_val[:, t] > 0, self.intrinsic_val[:, t], 0)

        simulation_vals = (self.intrinsic_val * stopping_rule * self.discount_table).sum(axis=1)
        self.expectation = np.average(simulation_vals)
        self.standard_error = np.std(simulation_vals) / np.sqrt(self.simulation_rounds)

        print('-' * 64)
        print(
            " American %s Longstaff-Schwartz method (assume polynomial fit)"
            " \n polynomial degree = %i \n S0 %4.1f \n K %2.1f \n"
            " Option Value %4.3f \n Standard Error %4.5f " % (
                option_type, poly_degree, self.S0, self.K, self.expectation, self.standard_error
            )
        )
        print('-' * 64)

        return self.expectation, self.standard_error


    def stock_price_simulation(self) -> Tuple[np.ndarray, float]:
        self.exp_mean = (self.mue - self.div_yield - (self.sigma ** 2.0) * 0.5) * self.h
        self.exp_diffusion = self.sigma * np.sqrt(self.h)

        self.z_t = np.random.standard_normal((self.simulation_rounds, self.no_of_slices))
        self.price_array = np.zeros((self.simulation_rounds, self.no_of_slices))
        self.price_array[:, 0] = self.S0

        for i in range(1, self.no_of_slices):
            self.price_array[:, i] = self.price_array[:, i - 1] * np.exp(
                self.exp_mean[:, i] + self.exp_diffusion[:, i] * self.z_t[:, i]
            )

        self.terminal_prices = self.price_array[:, -1]
        self.stock_price_expectation = np.mean(self.terminal_prices)
        self.stock_price_standard_error = np.std(self.terminal_prices) / np.sqrt(len(self.terminal_prices))

        print('-' * 64)
        print(
            " Number of simulations %4.1i \n S0 %4.1f \n K %2.1f \n Maximum Stock price %4.2f \n"
            " Minimum Stock price %4.2f \n Average stock price %4.3f \n Standard Error %4.5f " % (
                self.simulation_rounds, self.S0, self.K, np.max(self.terminal_prices),
                np.min(self.terminal_prices), self.stock_price_expectation, self.stock_price_standard_error
            )
        )
        print('-' * 64)

        return self.stock_price_expectation, self.stock_price_standard_error
