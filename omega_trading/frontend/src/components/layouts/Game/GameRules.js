/* eslint-disable no-unreachable */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, {useState} from 'react'

// State Stuff
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

function GameRules(props) {
    const [zone, setZone] = useState(null)

    GameRules.propTypes = {
        game: PropTypes.object,
        user: PropTypes.object
    }

    if (zone == null) {
        var timezone = new Date().toLocaleTimeString(undefined,{timeZoneName:'short'}).split(' ')[2]
        setZone(timezone)
    }

    const formatDate = (date) => {
        var month = date.month.toString()
        if (month.length == 1) {
            month = '0' + date.month
        }

        var day = date.day.toString()
        if (day.length == 1) {
            day = '0' + date.day
        }

        var min = date.minute
        if (min == 0) {
            min = '00'
        }

        return date.hour + ':' + min + ' ' + date.type + ' ' + month + '/' + day + '/' + date.year
    
    }

    if (props.game.type == 'long') {
        return (
            <div className="z-10 absolute top-1/3 right-0 bottom-0 left-0 flex items-start justify-center ">
                <div className="mx-2 w-full sm:w-4/5 ">
                    <div className="mx-auto max-w-4xl rounded-xl bg-red-200 p-4">
                        <div className="grid grid-cols-12 gap-x-4 gap-y-5 sm:gap-y-10 ">
                            <div className="col-span-12 sm:col-span-8">
                                <label className="block font-medium" htmlFor="">
                                    {props.game.name + ': ' + props.game.code}
                                </label>
                            </div>
                            <div className="col-span-6 sm:col-span-2 flex items-left sm:items-center justify-center flex-col">
                                <div className="block font-medium">
                                    {props.game.public ? 'Public' : 'Private'}
                                </div>
                            </div>
                            <div className="col-span-6 sm:col-span-2 flex items-left sm:items-center justify-center flex-col">
                                <div className="block font-medium" htmlFor="">
                                    {props.game.options ? 'Options' : 'No Options'}
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-4">
                                <label className="block font-medium" htmlFor="">
                                    Start Amount
                                </label>
                                <div className="block font-medium" htmlFor="">
                                ${props.game.start_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-4">
                                <label className="block font-medium" htmlFor="">
                                    Commision
                                </label>
                                <div className="block font-medium" htmlFor="">
                                    {props.game.commission == 0 ? 'Disabled' : props.game.commission}
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-4">
                                <label className="block font-medium" htmlFor="">
                                    Minimum Players
                                </label>
                                <div className="block font-medium" htmlFor="">
                                    {props.game.size}
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <label className="block font-medium pb-2" htmlFor="">
                                Duration
                                </label>
                                <div className="block font-medium" htmlFor="">
                                    {'From ' + formatDate(props.game.start_time) + ' to ' + formatDate(props.game.end_time)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (props.game.type == 'short') {
        return (
            <div className='z-10 absolute top-1/3 right-0 bottom-0 left-0 flex items-start justify-center '>
                <div className='mx-2 w-full sm:w-4/5 '>
                    <div className='mx-auto max-w-4xl rounded-xl bg-red-200 p-4'>
                        <div className='grid grid-cols-12 gap-x-4 gap-y-5 sm:gap-y-10 '>
                            <div className='col-span-12 sm:col-span-8'>
                                <label className="block font-medium" htmlFor="">
                                    {props.game.name + ': ' + props.game.code}
                                </label>
                            </div>
                            <div className='col-span-6 sm:col-span-2 flex items-left sm:items-center justify-center flex-col'>
                                <div className="block font-medium">
                                    {props.game.public ? 'Public' : 'Private'}
                                </div>
                            </div>
                            <div className='col-span-12 sm:col-span-6'>
                                <label className="block font-medium" htmlFor="">
                                    Start Amount
                                </label>
                                <div className="block font-medium" htmlFor="">
                                ${props.game.start_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </div>
                            </div>
                            <div className='col-span-12 sm:col-span-6'>
                                <label className='block font-medium' htmlFor=''>
                                    Size
                                </label>
                                <div className="block font-medium" htmlFor="">
                                    {props.game.size}
                                </div>
                            </div>
                            <div className='col-span-12 sm:col-span-6'>
                                <label className='block font-medium pb-2' htmlFor=''>
                                    Duration
                                </label>
                                <div className="block font-medium" htmlFor="">
                                    {props.game.duration + ' hours'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (props.game.type == 'tournament') {
        return (
            <>
                <div className="z-10 absolute top-16 right-0 bottom-2/3 left-0 flex items-center justify-center">
                    <h1 className="font-mono font-medium text-red-700 text-center text-4xl sm:text-6xl ">Create Game</h1>
                </div>

                <div className="z-10 absolute top-1/3 right-0 bottom-0 left-0 flex items-start justify-center ">
                    <div className="mx-2 w-full sm:w-4/5 ">
                        <div className="mx-auto max-w-4xl rounded-xl bg-red-200 p-4">
                            <div className="grid grid-cols-12 gap-x-4 gap-y-5 sm:gap-y-10 ">
                                <div className="col-span-12 sm:col-span-8">
                                    <label className="block font-medium" htmlFor="">
                                        {props.game.name + ': ' + props.game.code}
                                    </label>
                                </div>
                                <div className="col-span-6 sm:col-span-2 flex items-left sm:items-center justify-center flex-col">
                                    <div className="block font-medium" htmlFor="">
                                        {props.game.options ? 'Options' : 'No Options'}
                                    </div>
                                </div>
                                <div className="col-span-12 sm:col-span-6">
                                    <label className="block font-medium" htmlFor="">
                                    Commision
                                    </label>                                
                                    <div className="block font-medium" htmlFor="">
                                        {props.game.commission == 0 ? 'Disabled' : props.game.commission}
                                    </div>
                                </div>
                                <div className="col-span-12 sm:col-span-6">
                                    <label className='block font-medium' htmlFor=''>
                                    Size
                                    </label>
                                    <div className="block font-medium" htmlFor="">
                                        {props.game.size}
                                    </div>
                                </div>      
                            </div>                          
                        </div>
                    </div>
                </div>
            </>
        )
    }
}


const mapStateToProps = (state) => ({
    game: state.game.game,
    user: state.user.user
})

export default connect(mapStateToProps, {})(GameRules)