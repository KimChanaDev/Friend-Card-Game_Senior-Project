import '../ProfilePopup/ProfilePopUp.css'
import PropTypes from "prop-types";
import {SetJoinRoomDetail} from "../../store/GameSlice.jsx";
import {useDispatch} from "react-redux";


PasswordRoomPopup.propTypes = {
    CloseIsShowPasswordPopup: PropTypes.func,
    roomConnectObjectIfPasswordRequire: PropTypes.object
}
export default function PasswordRoomPopup({CloseIsShowPasswordPopup, roomConnectObjectIfPasswordRequire}) {
    const dispatch = useDispatch()

    function HandleClose () { CloseIsShowPasswordPopup() }
    function HandleEnter (event) {
        event.preventDefault()
        const password = new FormData(event.target).get('password');
        if (password === '' || password === null || password === undefined){
            alert("please enter password");
        }
        else{
            dispatch(SetJoinRoomDetail({
                roomDetail: roomConnectObjectIfPasswordRequire,
                password: password
            }))
        }
    }

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Room Lock! Please Enter Password</h2>
                <form onSubmit={HandleEnter}>
                    <br/>
                    <input name={"password"} id={"password"} placeholder={"Password"}/>
                    <br/>
                    <button type="submit">Enter</button>
                </form>
                <button onClick={HandleClose}>Cancel</button>
            </div>
        </div>
    )
}