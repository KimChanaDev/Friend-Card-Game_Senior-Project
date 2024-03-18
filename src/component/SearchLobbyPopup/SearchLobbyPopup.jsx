import '../ProfilePopup/ProfilePopUp.css'
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {GetRoom} from "../../service/Api/ApiService.jsx";
import {SetJoinRoomDetail} from "../../store/GameSlice.jsx";

SearchLobbyPopUp.propTypes = {
    CloseSearchLobbyPopup: PropTypes.func,
}
export default function SearchLobbyPopUp({CloseSearchLobbyPopup}) {
    const token = useSelector(state => state.userStore.token)
    const dispatch = useDispatch()

    async function HandleJoinRoom(event){
        event.preventDefault()
        const formData = new FormData(event.target);
        const matchId = formData.get('matchId');
        const password = formData.get('password');
        try{
            const room = await GetRoom(token, matchId)
            const joinRoomDetail = {
                roomDetail: room,
                password: password.toString() ?? null
            }
            dispatch(SetJoinRoomDetail(joinRoomDetail))
            CloseSearchLobbyPopup()
        }catch (e) {
            // console.log("Join room failed: ", e)
            alert(`Join room failed: ${e}`)
        }
    }

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Search Lobby</h2>
                <form onSubmit={HandleJoinRoom}>
                    <label>
                        Match ID:
                    </label>
                    <input name={"matchId"} id={"matchId"}/>
                    <br/>
                    <label>
                        Password:
                    </label>
                    <input name={"password"} id={"password"} placeholder={"Optional"}/>
                    <br/>
                    <button type="submit">Join</button>
                </form>
                <button onClick={CloseSearchLobbyPopup}>Cancel</button>
            </div>
        </div>
    )
}