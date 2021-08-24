/* eslint-disable semi */
/* eslint-disable indent */
import React, { useState, Fragment } from 'react';
import { create } from '../../../actions/game';
import { Tab, Switch, Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon, ArrowSmRightIcon } from '@heroicons/react/solid';
import { Redirect } from 'react-router-dom';

// State Stuff
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const totalPlayers = [
    { insert: '10', value: 10 },
    { insert: '20', value: 20 },
    { insert: '30', value: 30 },
    { insert: '40', value: 40 },
    { insert: '50', value: 50 },
    { insert: '100', value: 100 },
    { insert: '250', value: 250 },
    { insert: '500', value: 500 },
    { insert: '1000', value: 1000 },
];

const commissionAmounts = [
    { insert: 'Disabled', value: 0 },
    { insert: '$0.99', value: 0.99 },
    { insert: '$1.99', value: 1.99 },
    { insert: '$2.99', value: 2.99 },
    { insert: '$3.99', value: 3.99 },
    { insert: '$4.99', value: 4.99 },
    { insert: '$9.99', value: 9.99 },
    { insert: '$14.99', value: 14.99 },
    { insert: '$19.99', value: 19.99 },
];

const roundDurations = [
    { insert: '15 Minutes', value: 'mins' },
    { insert: 'Hour', value: 'hour ' },
    { insert: 'Day', value: 'day' },
    { insert: 'Week', value: 'week' },
];

const cryptocurrencies = ['BTC', 'ETH', 'LTC', 'BNB'];

function TournamentMode(props) {
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [totalPlayer, setTotalPlayer] = useState(totalPlayers[5]);
    const [hasBet, setHasBet] = useState(true);
    const [bet, setBet] = useState(null);
    const [options, setOptions] = useState(true);
    const [commission, seCommission] = useState(commissionAmounts[0]);
    const [cryptocurrency, setCryptocurrency] = useState(cryptocurrencies[0]);
    const [roundDuration, setRoundDuration] = useState(roundDurations[1]);

    TournamentMode.propTypes = {
        create: PropTypes.func.isRequired,
        creating_game: PropTypes.bool,
        game_created: PropTypes.bool,
        user: PropTypes.object,
        game: PropTypes.object,
    };

    if (props.game_created) {
        return <Redirect to={'/game?room_code=' + props.game.code} />;
    }

    const create = () => {
        if (name != '') {
            var gameBet = null;
            if (hasBet) {
                if (bet == null || bet == '') {
                    console.log('error'); // ADD SOMETHING TO DISPLAY ERROR MSG
                } else {
                    gameBet = {
                        bet: bet,
                        currency: cryptocurrency,
                        type: null,
                    };
                }
            }

            const rules = {
                name: name,
                rounds: roundDuration.value,
                commission: commission.value,
                size: totalPlayer.value,
                options: options,
                bet: gameBet,
            };

            props.create('tournament', rules);
        }
    };

    return (
        <>
            <div className="z-10 absolute top-16 right-0 bottom-3/4 sm:bottom-2/3 left-0 flex items-end sm:items-center justify-center">
                <h1 className="font-mono font-medium text-white text-center text-5xl sm:text-6xl  ">Tournament</h1>
            </div>

            <div className="z-10 absolute top-1/3 right-0 bottom-0 left-0 flex items-start justify-center ">
                <div className="mx-2 w-full sm:w-4/5 ">
                    <div className="mx-auto max-w-4xl rounded-xl sm:bg-gray-800 p-4">
                        <div className="grid grid-cols-12 gap-x-4 gap-y-5 sm:gap-y-10 ">
                            <div className="col-span-6 sm:col-span-8">
                                <label className="block text-lg font-medium text-white" htmlFor="">
                                    Name
                                </label>
                                <input
                                    className="h-10 w-full text-sm block px-2 rounded-md  shadow-md border-transparent focus:outline-none focus:ring focus:ring-yellow-300"
                                    placeholder="ex: Sabean's Tatties"
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-2 flex items-left sm:items-center justify-center flex-col">
                                <Switch.Group>
                                    <Switch.Label className="block font-medium text-white text-lg" htmlFor="">
                                        {isPublic ? 'Public' : 'Private'}
                                    </Switch.Label>

                                    <Switch
                                        checked={isPublic}
                                        onChange={setIsPublic}
                                        className={`${isPublic ? 'bg-green-500' : 'bg-blue-500'} shadow-md
relative inline-flex flex-shrink-0 h-10 w-20 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                    >
                                        <span className="sr-only">Use setting</span>
                                        <span
                                            aria-hidden="true"
                                            className={`${isPublic ? 'translate-x-10' : 'translate-x-0'}
pointer-events-none inline-block h-9 w-9 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                                        />
                                    </Switch>
                                </Switch.Group>
                            </div>
                            <div className="col-span-2 sm:col-span-2 flex items-left sm:items-center justify-center flex-col">
                                <Switch.Group>
                                    <Switch.Label className="block font-medium text-white text-lg" htmlFor="">
                                        {options ? 'Options' : 'No Options'}
                                    </Switch.Label>
                                    <Switch
                                        checked={options}
                                        onChange={setOptions}
                                        className={`${options ? 'bg-green-500' : 'bg-blue-500'} shadow-md
                      relative inline-flex flex-shrink-0 h-10 w-20 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                                    >
                                        <span className="sr-only">Use setting</span>
                                        <span
                                            aria-hidden="true"
                                            className={`${options ? 'translate-x-10' : 'translate-x-0'}
                      pointer-events-none inline-block h-9 w-9 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                                        />
                                    </Switch>
                                </Switch.Group>
                            </div>
                            <div className="col-span-12 sm:col-span-4">
                                <label className="block font-medium text-white text-lg" htmlFor="">
                                    Commission
                                </label>
                                <Listbox value={commission} onChange={seCommission}>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full h-10 py-2 pl-3 pr-10 text-left bg-white rounded-md shadow-md cursor-pointer focus:outline-none  sm:text-sm">
                                            <span className="block truncate">{commission.insert}</span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                            <Listbox.Options className="z-10 absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black  ring-opacity-5 focus:outline-none sm:text-sm">
                                                {commissionAmounts.map((commission, commissionIdx) => (
                                                    <Listbox.Option
                                                        key={commissionIdx}
                                                        className={({ active }) =>
                                                            `${active ? 'text-yellow-700 bg-yellow-100' : 'text-gray-900'}
cursor-pointer select-none relative py-2 pl-10 pr-4`
                                                        }
                                                        value={commission}
                                                    >
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>{commission.insert}</span>
                                                                {selected ? (
                                                                    <span
                                                                        className={`${active ? 'text-amber-600' : 'text-amber-600'}
absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                    >
                                                                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                            <div className="col-span-12 sm:col-span-4">
                                <label className="block font-medium text-white text-lg" htmlFor="">
                                    Players
                                </label>
                                <Listbox value={totalPlayer} onChange={setTotalPlayer}>
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full h-10 py-2 pl-3 pr-10 text-left bg-white rounded-md shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                                            <span className="block truncate">{totalPlayer.insert}</span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                            <Listbox.Options className="z-10 absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black  ring-opacity-5 focus:outline-none sm:text-sm">
                                                {totalPlayers.map((totalPlayer, totalPlayerIdx) => (
                                                    <Listbox.Option
                                                        key={totalPlayerIdx}
                                                        className={({ active }) =>
                                                            `${active ? 'text-yellow-700 bg-yellow-100' : 'text-gray-900'}
cursor-pointer select-none relative py-2 pl-10 pr-4`
                                                        }
                                                        value={totalPlayer}
                                                    >
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>{totalPlayer.insert}</span>
                                                                {selected ? (
                                                                    <span
                                                                        className={`${active ? 'text-amber-600' : 'text-amber-600'}
absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                    >
                                                                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                            <div className="col-span-12 sm:col-span-4">
                                <label className="block font-medium text-lg text-white" htmlFor="">
                                    Duration
                                </label>
                                <Listbox value={roundDuration} onChange={setRoundDuration}>
                                    <div className="relative mt-1 flex-1">
                                        <Listbox.Button className="relative w-full h-10 py-2 pl-3 pr-10 text-left bg-white rounded-md shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                                            <span className="block truncate">{roundDuration.insert}</span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>
                                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                            <Listbox.Options className="z-10 absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black  ring-opacity-5 focus:outline-none sm:text-sm">
                                                {roundDurations.map((theroundDuration, roundDurationIdx) => (
                                                    <Listbox.Option
                                                        key={roundDurationIdx}
                                                        className={({ active }) =>
                                                            `${active ? 'text-yellow-700 bg-yellow-100' : 'text-gray-900'}
cursor-pointer select-none relative py-2 pl-10 pr-4`
                                                        }
                                                        value={theroundDuration}
                                                    >
                                                        {({ selected, active }) => (
                                                            <>
                                                                <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>{theroundDuration.insert}</span>
                                                                {selected ? (
                                                                    <span
                                                                        className={`${active ? 'text-amber-600' : 'text-amber-600'}
absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                    >
                                                                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                            <div className="col-span-12">
                                <Tab.Group>
                                    <label className="block font-medium pb-2 text-white text-lg" htmlFor="">
                                        Crypto Bet
                                    </label>
                                    <Tab.List className="flex items-start justify-start pb-2">
                                        <span className="flex shadow-md rounded-md">
                                            <Tab
                                                className={({ selected }) =>
                                                    `${selected ? 'bg-white text-md text-gray-900' : ' text-gray-500 text-md'}
    p-2 rounded-l-lg`
                                                }
                                                onClick={() => setHasBet(true)}
                                            >
                                                Active
                                            </Tab>
                                            <Tab
                                                className={({ selected }) =>
                                                    `${selected ? 'bg-white text-md text-gray-900' : ' text-gray-500 text-md'}
    p-2 rounded-r-lg`
                                                }
                                                onClick={() => setHasBet(false)}
                                            >
                                                Disabled
                                            </Tab>
                                        </span>
                                    </Tab.List>
                                    <Tab.Panels>
                                        <Tab.Panel>
                                            <div className=" flex items-center justify-center space-x-2">
                                                <div className="relative rounded-md shadow-sm sm:flex-1 w-20 sm:w-full">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">$</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="price"
                                                        id="price"
                                                        className="h-10 border-transparent focus:outline-none block w-full pl-7 pr-2 rounded-md text-sm  bg-white"
                                                        placeholder="0.00"
                                                        onChange={(e) => setBet(e.target.value)}
                                                    />
                                                </div>
                                                <ArrowSmRightIcon className="w-5 h-5 text-yellow-500" aria-hidden="true" />
                                                <div className="relative rounded-md shadow-sm flex-1">
                                                    <input
                                                        disabled
                                                        type="number"
                                                        name="price"
                                                        id="price"
                                                        className="h-10 text-sm border-transparent focus:outline-none bg-white focus:ring focus:ring-yellow-300 block w-full pl-2 pr-12 sm:text-sm  rounded-md"
                                                        placeholder="0.00"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                                        <label htmlFor="currency" className="sr-only text-white text-lg">
                                                            Currency
                                                        </label>
                                                        <Listbox value={cryptocurrency} onChange={setCryptocurrency}>
                                                            <div className="relative">
                                                                <Listbox.Button className="relative w-full h-10 py-2 pl-3 pr-10 text-left bg-white rounded-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                                                                    <span className="block truncate">{cryptocurrency}</span>
                                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                                        <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                                                    </span>
                                                                </Listbox.Button>
                                                                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                                                    <Listbox.Options className="z-10 absolute right-0 w-28 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black  ring-opacity-5 focus:outline-none sm:text-sm">
                                                                        {cryptocurrencies.map((crypto, cryptoIndex) => (
                                                                            <Listbox.Option
                                                                                key={cryptoIndex}
                                                                                className={({ active }) =>
                                                                                    `${active ? 'text-yellow-900 bg-yellow-100' : 'text-gray-900'}
cursor-pointer select-none relative py-2 pl-10 pr-4`
                                                                                }
                                                                                value={crypto}
                                                                            >
                                                                                {({ selected, active }) => (
                                                                                    <>
                                                                                        <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>{crypto}</span>
                                                                                        {selected ? (
                                                                                            <span
                                                                                                className={`${active ? 'text-amber-600' : 'text-amber-600'}
absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                                            >
                                                                                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                                                            </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )}
                                                                            </Listbox.Option>
                                                                        ))}
                                                                    </Listbox.Options>
                                                                </Transition>
                                                            </div>
                                                        </Listbox>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab.Panel>
                                    </Tab.Panels>
                                </Tab.Group>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <button className="block bg-yellow-500 text-gray-900 text-xl sm:text-2xl py-4 px-7 mt-10 mb-32 sm:mb-0 rounded-lg shadow-md" onClick={create}>
                            Create Game
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = (state) => ({
    creating_game: state.game.creating_game,
    game_created: state.game.game_created,
    user: state.user.user,
    game: state.game.game,
});

export default connect(mapStateToProps, { create })(TournamentMode);
