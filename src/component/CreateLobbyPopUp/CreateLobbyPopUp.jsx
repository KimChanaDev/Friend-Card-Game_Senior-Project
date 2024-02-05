import '../ProfilePopup/ProfilePopUp.css'
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {PostCreateRoom} from "../../service/Api/ApiService.jsx";
import {SetJoinRoomDetail} from "../../store/GameSlice.jsx";

CreateLobbyPopUp.propTypes = {
    CloseCreateLobbyPopup: PropTypes.func
}
export default function CreateLobbyPopUp({CloseCreateLobbyPopup}) {
    const token = useSelector(state => state.userStore.token)
    const dispatch = useDispatch()

    async function HandleCreateRoom(event){
        event.preventDefault()
        const formData = new FormData(event.target);
        const lobbyName = formData.get('lobbyName');
        const password = formData.get('password');
        try{
            const room = await PostCreateRoom(token, lobbyName, password)
            const joinRoomDetail = {
                roomDetail: room,
                password: password.toString() ?? null
            }
            dispatch(SetJoinRoomDetail(joinRoomDetail))
            CloseCreateLobbyPopup()
        }catch (e){
            console.log("Create room failed: ", e)
            alert(`Create room failed: ${e}`)
        }
    }

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Create Lobby</h2>
                <form onSubmit={HandleCreateRoom}>
                    <label>
                        Lobby Name:
                    </label>
                    <input name={"lobbyName"} id={"lobbyName"}/>
                    <br/>
                    <label>
                        Password:
                    </label>
                    <input name={"password"} id={"password"} placeholder={"Optional"}/>
                    <br/>
                    <button type="submit">Create</button>
                </form>
                <button onClick={CloseCreateLobbyPopup}>Cancel</button>
            </div>
        </div>
    )
}