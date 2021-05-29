import React, { useState, CSSProperties } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, Redirect } from 'react-router-dom';
import MyNavbar from './MyNavbar';

// State Stuff
import PropTypes from "prop-types";
import { connect } from "react-redux";

function Chart(props) {

    var numbers = [{ "time": "9:30", "price": 11.56 }, { "time": "9:35", "price": 11.60 }, { "time": "9:40", "price": 11.67 }, { "time": "9:45", "price": 11.55 }, { "time": "9:50", "price": 11.77 }, { "time": "9:55", "price": 11.88 }, { "time": "10:00", "price": 11.97 }, { "time": "10:05", "price": 12.03 }, { "time": "10:10", "price": 11.96 }, { "time": "10:15", "price": 12.10 }]
    var count = 1;
    Chart.propTypes = {

    }

    var min = numbers[0]["price"];
    var max = 0;
    var prevAngle = 0;

    for (var i = 0; i < numbers.length; i++) {
        var price = numbers[i]["price"];
        if (price > max) {
            max = price;
        }
        if (price < min) {
            min = price
        }
    }

    const height = (price) => {
        return ((((price - min)) * 350) / 1.1) + 87.5;
    }

    const generatePoint = (point) => {
        var rightShift = count * 10.25;
        var topShift = height(point["price"]);

        const myStyle_point = {
            "--y": topShift.toString() + "px",
            "--x": rightShift.toString() + "px"
        }
        const length = numbers.reduce((a, obj) => a + Object.keys(obj).length, 0) / 2;
        if (count == length) {
            return (
                < li style={myStyle_point}>
                    <div className="data-point" data-value={point["price"]}></div>
                </li >
            )
        }

        var nextPoint = numbers[count];
        var opposite = topShift - height(nextPoint["price"]);
        var hypotenuse = Math.sqrt(105.0625 + (opposite * opposite));
        var angle = Math.asin(opposite / hypotenuse) * (180 / Math.PI);


        // Clean decreasing lines

        var gapAngle = 180 - ((180 - (90 + Math.abs(prevAngle))) + 90 + Math.abs(angle));
        //gapAngle = gapAngle * (Math.PI / 180);
        var triAngle = 90 - (180 - (90 + Math.abs(prevAngle)));
        var triBase = Math.sqrt(8 - (8 * Math.cos(gapAngle)));
        var triHeight = Math.sqrt(4 - (.5 * triBase));
        var coverTriHeight = Math.sqrt(((triBase / 2) * (triBase / 2)) + (triHeight * triHeight));
        var coverAngles = 90 - (Math.asin(triHeight / coverTriHeight) * (180 / Math.PI));

        if (gapAngle < 45) {
            var triStyle = {
                "--gap": triBase.toString() + "px",
                "--coverAngle": coverAngles,
                "--triHeight": triHeight.toString() + "px",
                "--coverHeight": coverTriHeight.toString() + "px",
                "--rotate": triAngle
            }
            var triangle = (
                <div className="line-connector" style={triStyle}></div>
            )
        }



        var myStyle_segment = {
            "--hypotenuse": hypotenuse,
            "--angle": angle
        };

        count++;
        prevAngle = angle;

        return (
            < li style={myStyle_point}>
                <div className="line-segment" style={myStyle_segment}></div>
                <div className="data-point" data-value={point["price"]}></div>
                {triangle}
            </li >
        )

    }

    const generateLine = () => {
        return numbers.map((point) =>
            generatePoint(point)
        )
    }



    return (
        <figure className="Full-Chart">
            <ul className="Chart">
                {generateLine()}
            </ul>
        </figure>
    )
}


const mapStateToProps = () => ({

});

export default connect(mapStateToProps)(Chart);