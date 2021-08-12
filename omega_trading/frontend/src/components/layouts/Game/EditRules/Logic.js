import { useState } from 'react'

const duration = (game) => {
    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [mins, setMins] = useState(0)
    const [good, setGood] = useState(true)

    if (game.time == undefined) {
        if (good) {
            setDays(game.duration.days)
            setHours(game.duration.hours)
            setMins(game.duration.mins)
            setGood(false)
        }
    }
    
    const changeDays = (day) => {
        setDays(day)
    }

    const changeHours = (hour) => {
        setHours(hour)
    }

    const changeMins = (min) => {
        setMins(min)
    }

    return {
        days,
        changeDays,
        hours,
        changeHours,
        mins,
        changeMins
    }
}

const date = (game) => {
    const [date, setDate] = useState(null)
    const [dateHour, setHour] = useState(null)
    const [dateMin, setMin] = useState('00')
    const [dateType, setType] = useState('AM')
    const DateO = new Date()
    const currentYear = DateO.getFullYear()
    var currentMonth = DateO.getMonth() + 1
    var currentDay = DateO.getDate()

    if (game.duration == undefined) {
        if (date == null) {
            var month = game.time.month.toString()
            if (month.length == 1) {
                month = '0' + month
            }

            var day = game.time.day.toString()
            if(day.length == 1) {
                day = '0' + day
            }

            var minute = game.time.minute.toString()
            if (minute.length == 1) {
                minute = '0' + minute
            }

            setMin(minute)
            setHour(game.time.hour)
            setType(game.time.type)
            setDate(game.time.year + '-' + month + '-' + day)
        }
    }
    else {
        if (date == null) {               
            if (currentMonth.toString().length == 1) {
                currentMonth = '0' + currentMonth
            }
                
            if (currentDay.toString().length == 1) {
                currentDay = '0' + currentDay
            }
    
            var Hour = DateO.getHours() + 1
            
            if (Hour > 12) {
                Hour = Hour - 12
                setType('PM')
            }
            setHour(Hour)
            setMin('00')            
            setDate(currentYear + '-' + currentMonth + '-' + currentDay)
        }        
    }

    const handleDate = (date) => {
        setDate(date)
    }

    const changeDateHour = (hour) => {
        setHour(hour)
    }

    const changeDateMin = (min) => {
        setMin(min)
    }

    const changeDateType = (type) => {
        setType(type)
    }

    var minimum = currentYear + '-' + currentMonth + '-' + currentDay
    var max = (currentYear + 1) + '-' + currentMonth + '-' + currentDay

    return {
        date,
        handleDate,
        dateHour,
        changeDateHour,
        dateMin,
        changeDateMin,
        dateType,
        changeDateType,
        minimum,
        max
    }   
}

const editDate = (props) => {
    console.log(props)
    var {
        date,
        dateHour,
        dateMin,
        dateType,
        commission
    } = props

    var month = Number(date.substring(5, 7))
    var day = Number(date.substring(8))
    var year = Number(date.substring(0,4))
        
    var end = {
        year: year,
        month: month,
        day: day
    }

    const checkDate = () => {
        var end_hour = Number(dateHour)
        if (dateType =='PM') {
            end_hour += 12
        }

        if (dateMin == '00') {
            dateMin = 0
        }

        var end_time = (new Date(end.year, (end.month - 1), end.day, end_hour, Number(dateMin)).getTime() / 1000).toFixed(0)
        var current = (Date.now() / 1000).toFixed(0)

        if (end_time - current <= 43200) {
            return false
        }
        else {
            return true
        }
    }
    if (checkDate()) {
        var comish = commission
        if (commission == 'Disabled') {
            comish = null
        }
    
        var end_date = {
            year: end.year,
            month: end.month,
            day: end.day,
            hour: Number(dateHour),
            min: Number(dateMin),
            type: dateType
        }
        var error = false
        var message = ''
    }
    else {
        error = true
        message = 'If game ends on date, it must be at least 12 hours'
    }
    
    return {
        error,
        message,
        comish,
        end_date
    }
}

const editDuration = (props) => {
    console.log(props)
    const {
        days,
        hours,
        mins,
        commission
    } = props

    var commish = commission
    if (commission == 'Disabled') {
        commish = null
    }

    if (days == 0 && hours == 0 && mins == 0) {
        var isError = true
        var message2 = 'A duration must be set to create a game'
    }
    else {
        var endDate = {
            days: Number(days),
            hours: Number(hours),
            mins: Number(mins)
        }
        isError = false
        message2 = ''
    }

    return {
        isError,
        message2,
        commish,
        endDate
    }
}


export const Duration = (duration)
export const EndDate = (date)
export const EditDate = (editDate)
export const EditDuration = (editDuration)
