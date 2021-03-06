import css from '../styles/clock.module.css'
import React,{ useState, useEffect } from 'react';
import { GetStaticProps } from 'next'
export default function clock(){
    //time variable
    let [count, setCount] = useState(0);
    let minute: string = `0${Math.floor(count / 60)}`.slice(-2);
    let second: string = `0${count % 60}`.slice(-2);
    const workTime: number = 10;
    const breakTime: number = 5;
    
    //status = 0 initialStatus; status = 1 workTime; status = 2 breakTime
    let [status, setStatus] = useState(0);



    //notification
    const startNotification = async () => {
        console.log("start");
        await window.electron.dialogMsg("Work Time");
    };

    const finishNotification = async () => {
        console.log("start");
        await window.electron.dialogMsg("Break Time");
    };



    //audio
    function startmp3(){
        let startAudio = new Audio()
        startAudio.src = "/music/bell.mp3" 
        startAudio.volume = 0.5
        startAudio.play()
    }

    function finishmp3(){
        let finishAudio = new Audio()
        finishAudio.src = "/music/gong.mp3" 
        finishAudio.volume = 0.5
        finishAudio.play()
    }



    //DataBase
    const dialogAction = async () => {
        console.log("dialogAction");
        await window.electron.testdb();
    };

    const dbupdate = async () => {
        console.log("dbupdate");
        await window.electron.dbupdate();
    };

    const getAllData = async () => {
        console.log("getAllData");
        await window.electron.getAllData();
    };
 


    //Timer
    function setTime(time){
        setCount(time);
    }

    function countdown(){
        setCount(count - 1);
    }




    useEffect(() => {
        if(status !== 0){
            if (count >= 0 && (status === 1 || status === 2 )) {
                const timerId = setInterval(countdown, 1000);
                return () => clearInterval(timerId);
            }
            if (count <= 0) {
                if (status === 1) {
                    setTime(breakTime)
                    setStatus(2);
                    finishNotification();
                    finishmp3();
                    dbupdate();
                } else if (status === 2) {
                    setTime(workTime)
                    setStatus(1);
                    startNotification();
                    startmp3();
                }
            }
        }
    },);

    return (
 
        <>
            <button onClick={() => { setTime(workTime);  setStatus(1); }} >????????????</button>
            <div className={css.time}>
                {minute}:{second}
            </div>
        </>
    )
}
