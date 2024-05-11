import './ProfilePopUp.css'
import PropTypes from "prop-types";
import {Logout} from "../../store/UserSlice.tsx";
import {useDispatch, useSelector} from "react-redux";
import COOKIE from "../../enum/CookieNameEnum.jsx";

ProfilePopUp.propTypes = {
    CloseProfileDetail: PropTypes.func,
    removeCookie: PropTypes.func,
}
export default function ProfilePopUp({CloseProfileDetail, removeCookie}) {
    const dispatch = useDispatch()
    function HandleLogout(){
        dispatch(Logout())
        removeCookie(COOKIE.name)
        CloseProfileDetail()
    }

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Profile</h2>
                <label>
                    Username:
                </label>
                <br/>
                <button onClick={HandleLogout}>Logout</button>
                <br/>
                <button onClick={CloseProfileDetail}>Close</button>
            </div>
        </div>
    )
}

