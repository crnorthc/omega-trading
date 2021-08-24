import React from 'react'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

function SearchyFilters() {
    return (
        <div className='w-60 h-full overflow-auto hidden sm:block py-4 px-3 '>
            <Disclosure as='div' className='border-b-2'>
                {({ open }) => (
                    <>
                        <Disclosure.Button className='flex justify-between w-full px-4 py-4 text-sm font-medium text-left text-white'>
                            <span>Start Amount</span>
                            <ChevronUpIcon
                                className={`${
                                    open ? 'transform rotate-180' : ''
                                } w-5 h-5 text-purple-500`}
                            />
                        </Disclosure.Button>
                        <Transition
                            enter='transition duration-100 ease-out'
                            enterFrom='transform scale-95 opacity-0'
                            enterTo='transform scale-100 opacity-100'
                            leave='transition duration-75 ease-out'
                            leaveFrom='transform scale-100 opacity-100'
                            leaveTo='transform scale-95 opacity-0'
                        >
                            <Disclosure.Panel className='px-4 p-2 pb-2 text-sm text-gray-500'>
                  If you're unhappy with your purchase for any reason, email us
                  within 90 days and we'll refund you in full, no questions
                  asked.
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
            <Disclosure as='div' className='border-b-2'>
                {({ open }) => (
                    <>
                        <Disclosure.Button className='flex justify-between w-full px-4 py-4 text-sm font-medium text-left text-white'>
                            <span>Commision</span>
                            <ChevronUpIcon
                                className={`${
                                    open ? 'transform rotate-180' : ''
                                } w-5 h-5 text-purple-500`}
                            />
                        </Disclosure.Button>
                        <Transition
                            enter='transition duration-100 ease-out'
                            enterFrom='transform scale-95 opacity-0'
                            enterTo='transform scale-100 opacity-100'
                            leave='transition duration-75 ease-out'
                            leaveFrom='transform scale-100 opacity-100'
                            leaveTo='transform scale-95 opacity-0'
                        >
                            <Disclosure.Panel className='px-4 p-2 pb-2 text-sm text-gray-500'>
                If you're unhappy with your purchase for any reason, email us
                within 90 days and we'll refund you in full, no questions asked.
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
            <Disclosure as='div' className='border-b-2'>
                {({ open }) => (
                    <>
                        <Disclosure.Button className='flex justify-between w-full px-4 py-4 text-sm font-medium text-left text-white'>
                            <span>Cryptobet</span>
                            <ChevronUpIcon
                                className={`${
                                    open ? 'transform rotate-180' : ''
                                } w-5 h-5 text-purple-500`}
                            />
                        </Disclosure.Button>
                        <Transition
                            enter='transition duration-100 ease-out'
                            enterFrom='transform scale-95 opacity-0'
                            enterTo='transform scale-100 opacity-100'
                            leave='transition duration-75 ease-out'
                            leaveFrom='transform scale-100 opacity-100'
                            leaveTo='transform scale-95 opacity-0'
                        >
                            <Disclosure.Panel className='px-4 p-2 pb-2 text-sm text-gray-500'>
                If you're unhappy with your purchase for any reason, email us
                within 90 days and we'll refund you in full, no questions asked.
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
            <Disclosure as='div' className='border-b-2'>
                {({ open }) => (
                    <>
                        <Disclosure.Button className='flex justify-between w-full px-4 py-4 text-sm font-medium text-left text-white'>
                            <span>Date</span>
                            <ChevronUpIcon
                                className={`${
                                    open ? 'transform rotate-180' : ''
                                } w-5 h-5 text-purple-500`}
                            />
                        </Disclosure.Button>
                        <Transition
                            enter='transition duration-100 ease-out'
                            enterFrom='transform scale-95 opacity-0'
                            enterTo='transform scale-100 opacity-100'
                            leave='transition duration-75 ease-out'
                            leaveFrom='transform scale-100 opacity-100'
                            leaveTo='transform scale-95 opacity-0'
                        >
                            <Disclosure.Panel className='px-4 p-2 pb-2 text-sm text-gray-500'>
                If you're unhappy with your purchase for any reason, email us
                within 90 days and we'll refund you in full, no questions asked.
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
            <Disclosure as='div' className='border-b-2'>
                {({ open }) => (
                    <>
                        <Disclosure.Button className='flex justify-between w-full px-4 py-4 text-sm font-medium text-left text-white'>
                            <span>Duration</span>
                            <ChevronUpIcon
                                className={`${
                                    open ? 'transform rotate-180' : ''
                                } w-5 h-5 text-purple-500`}
                            />
                        </Disclosure.Button>
                        <Transition
                            enter='transition duration-100 ease-out'
                            enterFrom='transform scale-95 opacity-0'
                            enterTo='transform scale-100 opacity-100'
                            leave='transition duration-75 ease-out'
                            leaveFrom='transform scale-100 opacity-100'
                            leaveTo='transform scale-95 opacity-0'
                        >
                            <Disclosure.Panel className='px-4 p-2 pb-2 text-sm text-gray-500'>
                If you're unhappy with your purchase for any reason, email us
                within 90 days and we'll refund you in full, no questions asked.
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
            <Disclosure as='div' className='border-b-2'>
                {({ open }) => (
                    <>
                        <Disclosure.Button className='flex justify-between w-full px-4 py-4 text-sm font-medium text-left text-white'>
                            <span>Options</span>
                            <ChevronUpIcon
                                className={`${
                                    open ? 'transform rotate-180' : ''
                                } w-5 h-5 text-purple-500`}
                            />
                        </Disclosure.Button>
                        <Transition
                            enter='transition duration-100 ease-out'
                            enterFrom='transform scale-95 opacity-0'
                            enterTo='transform scale-100 opacity-100'
                            leave='transition duration-75 ease-out'
                            leaveFrom='transform scale-100 opacity-100'
                            leaveTo='transform scale-95 opacity-0'
                        >
                            <Disclosure.Panel className='px-4 p-2 pb-2 text-sm text-gray-500'>
                If you're unhappy with your purchase for any reason, email us
                within 90 days and we'll refund you in full, no questions asked.
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
        </div>
    )
}

export default SearchyFilters
