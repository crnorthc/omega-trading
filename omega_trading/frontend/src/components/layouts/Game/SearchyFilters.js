import React from 'react'
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

function SearchyFilters() {
    return (
      <div className='w-60 hidden sm:block py-4 px-3 bg-gray-800'>
        <Disclosure>
          {({ open }) => (
            
            <div className="border-b-2">
              <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                <span>What is your refund policy?</span>
                <ChevronUpIcon
                  className={`${
                    open ? "transform rotate-180" : ""
                  } w-5 h-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-500'>
                If you're unhappy with your purchase for any reason, email us
                within 90 days and we'll refund you in full, no questions asked.
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
        <Disclosure as='div' className='mt-2'>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white  focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'>
                <span>Do you offer technical support?</span>
                <ChevronUpIcon
                  className={`${
                    open ? "transform rotate-180" : ""
                  } w-5 h-5 text-purple-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-500'>
                No.
              </Disclosure.Panel>
              
            </>
          )}
        </Disclosure>
      </div>
    );
}

export default SearchyFilters
