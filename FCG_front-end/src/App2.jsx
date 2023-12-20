import {useDispatch, useSelector} from "react-redux";
import PageStateEnum from "./enum/PageStateEnum.jsx";
import {useCookies} from "react-cookie";
import {useEffect} from "react";
import {Login} from "./store/UserSlice.jsx"
import CookieName from "./enum/CookieNameEnum.jsx";
import Menu from "./interface/Menu.jsx"
import InGameInterface2 from "./interface/InGameInterface2.jsx";
import Loading from "./interface/Loading.jsx";

function App2() {

    const pageState = useSelector(state => state.pageStateStore.pageState)
    const [cookies, setCookie, removeCookie] = useCookies([CookieName.name]);
    const dispatch = useDispatch()

    useEffect(() => {
        if (cookies[CookieName.name]){
            dispatch(Login({
                userId: cookies[CookieName.name].userId,
                username: cookies[CookieName.name].username,
                token: cookies[CookieName.name].token
            }))
        }
    }, []);

    function RenderPage(){
        switch (pageState) {
            case PageStateEnum.MENU:
                return ( <Menu setCookie={setCookie} removeCookie={removeCookie}/> )
            case PageStateEnum.IN_GAME_INTERFACE:
                return ( <InGameInterface2 /> )
            case PageStateEnum.LOADING:
                return ( <Loading /> )
            default:
                return null
        }
    }
    return (
        <>
            {RenderPage()}
        </>
    )
}
export default App2
