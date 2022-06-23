import React from "react";
import './Reservation.css'

const amountShownDays = 7;
const testUserID = 2;

const saveButton = (
  <>
    <div id="saveButtonDiv" class="div-hidden">
      <button 
      id="saveButton" 
      class="saveButton" 
      onClick={saveChanges}>
        Save Changes
      </button>
      <br></br>
    </div>
  </>
)

let reservations = [
  {
    id: 1,
    user_id: 3,
    seat_id: 1,
    start: "2022-06-25T12:00:00+02:00",
    duration: 1,
  },
  {
    id: 2,
    user_id: 2,
    seat_id: 2,
    start: "2022-06-26T08:00:00+02:00",
    duration: 3,
  },
  {
    id: 3,
    user_id: 2,
    seat_id: 1,
    start: "2022-06-24T14:00:00+02:00",
    duration: 2,
  },
  {
    id: 4,
    user_id: 1,
    seat_id: 3,
    start: "2022-06-24T11:00:00+02:00",
    duration: 4,
  },
  {
    id: 5,
    user_id: 2,
    seat_id: 3,
    start: "2022-06-27T11:00:00+02:00",
    duration: 6,
  }
]

let workplaces = ["1", "2", "3", "4", "5"];

function Reservation() {

  var currentTime = new Date()

  var days = [];
  for (let i = 0; i < amountShownDays; i++) {
      days.push(getDateFormat(currentTime));
      currentTime.setDate(currentTime.getDate() + 1);
  }

  var times = [];
  for (let i = 8; i < 18; i++) {
    times.push(i);
  }

  var counter = 0;

  var col = workplaces.length;

  const table = (
    <>
      <table class="table">
        <thead>
          <tr class="t-row">
            <th scope="col" class="sidebar" rowSpan="2"></th>
            { days && days.map(e => <th id="dynAmountSeats" class="t-head" colSpan={col}>{e}</th>) }
          </tr>
          <tr class="t-row">
          { days && days.map(day => (
            workplaces && workplaces.map(workplace => <th class="t-head">{workplace}</th>)
          )) }
          </tr>
        </thead>
        <tbody>
          {times.map(time => (
            <tr class="t-row">
              <td class="sidebar">{times[counter]}:00 - {times[counter++]+1}:00</td>
              { days && days.map(day => (
                workplaces && workplaces.map(workplace => checkBooked(workplace, day, time))
              )) }
            </tr>
          ))}
        </tbody>
      </table>
      {saveButton}
    </>
  )


  return (
    <>
      <h2>Reservation:</h2>
        {table}
        {myReservations}
    </>
  );
}

var selectedSlots_ID=[]

function selectSlotToAdd(id) {
  var e = document.getElementById(id);
  var button = document.getElementById("saveButtonDiv")
  if(e.className==="cell-selected") {
    e.className="cell"
    selectedSlots_ID = selectedSlots_ID.filter(i => i !== id)
    if(selectedSlots_ID.length===0){
      button.className="div-hidden"
    }
  } else {
    e.className = "cell-selected"
    selectedSlots_ID.push(id);
    button.className="div"
  }
  console.log("Selected Slots: " + selectedSlots_ID)
}

function editSlot(workplace, date, time, id) {
  var e = document.getElementById(id);
  e.className = "cell-selected"
}

function saveChanges(){
  /*var cutWorkplace = selectedSlots_ID.map(id => (id.split('_')[0] +"_"+ id.split('_')[1]))
  var findDuplicates = cutWorkplace => cutWorkplace.filter((item, index) => cutWorkplace.indexOf(item) !== index)

  var c = 0;
  var duplicats = [];

  selectedSlots_ID.map(id => findDuplicates(cutWorkplace).filter(d => d===id.split('_')[0] +"_"+ id.split('_')[1])).map(item => {
    if(item.length!=0){
      item = selectedSlots_ID[c]
      duplicats.push(item)
    }
    c++;
  })
  var resWithoutDuplicats = selectedSlots_ID
  console.log(duplicats)*/

  var test = selectedSlots_ID.map(e => [parseInt(e.split('_')[0]), parseInt(e.split('_')[1]), parseInt(e.split('_')[2])])
  var test2 = test.map(i => {
    var later = [i[0], i[1], i[2]+1]
    if(test.filter(f => later[0]==f[0] && later[1]==f[1] && later[2]==f[2]).length!=0){
      console.log("earlier(i): " + i + ", later: " + later)
      return i;
    }
  })
  console.log(test)
  console.log(test2)
}

var diffDays = 0;
var startDay = "";

function checkBooked(workplace, day, time) {

  let datepieces = day.split('.');
  var date = new Date(datepieces[2]+"-"+datepieces[1]+"-"+datepieces[0]);

  if(startDay===""){
    startDay=date;
  } 
  diffDays=(date-startDay)/(1000*60*60*24);
  

  var id = diffDays + "_" + workplace + "_" + time;
  var output = <td id={id} class="cell" onClick={() => selectSlotToAdd(id)}></td>;

  reservations.forEach((r) => {
    var classCellBooked = "cell-booked"
    if(r.user_id===testUserID){
      classCellBooked = "cell-booked-user"
    }
    var r_date = new Date(r.start);
    if(r.seat_id==workplace){
      if(date.getDate()===r_date.getDate() && date.getMonth()===r_date.getMonth() && date.getFullYear()===r_date.getFullYear()){
        if(r_date.getHours()===time){
          var end = r_date.getHours() + r.duration;
          id = diffDays + "_" + workplace + "_" + time + "-" + (time+r.duration-1);
          if(time>=r_date.getHours() && time<end){
            output = <td id={id} class={classCellBooked} rowSpan={r.duration} onClick={() => editSlot(workplace, date, time, id)}></td>;
          }
        } else if (time>=r_date.getHours() && r_date.getHours()+r.duration>time){
          output = "";
        }
      } 
    }
  });
  return output;
}

const r = reservations.filter(checkUser)

const myReservations = (
  <>
    <br></br>
    <h2>My Reservations:</h2>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Seat</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {r.map((r) => (
            <tr>
              <td>{r.seat_id}</td>
              <td>{getDateFormat(new Date(r.start))}</td>
              <td>{new Date(r.start).getHours()+":00 - " + (new Date(r.start).getHours()+r.duration) + ":00"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
)

function getDateFormat(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  return day + "." + month + "." + year;
}

function checkUser(res){
  return res.user_id===testUserID;
}


export default Reservation;
