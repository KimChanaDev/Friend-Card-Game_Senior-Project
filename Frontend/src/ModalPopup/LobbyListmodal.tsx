import React ,{ useEffect } from 'react'
import ModalRWD from './ModalRWD';
import {CustomTable} from '../components/Custom-table';
import { lobbyTableHeaders , TableData} from '../config/table-data';
import {GetRooms} from "../service/Api/ApiService.jsx";
import {Logout, UserState} from "../store/UserSlice";
import {useDispatch} from "react-redux";
import {SetPage} from "../store/PageStateSlice.jsx";
import PAGE_STATE from "../enum/PageStateEnum.jsx";
import {useCookies} from "react-cookie";
import COOKIE from "../enum/CookieNameEnum.jsx";
import "./LobbyListmodal.css"


interface LobbyModalProps{
    onBackdropClick:() => void;
    isModalVisible: boolean;
    userData?: UserState
}

const LobbyModal: React.FC<LobbyModalProps> =({isModalVisible,onBackdropClick,userData}) => {
    const [games, setGames] = React.useState<TableData[]>([]);
    const [filterId, setFilterId] = React.useState<string>("");
    const dispatch = useDispatch()
    const [cookies, setCookie, removeCookie] = useCookies([COOKIE.name]);

    useEffect(() => {
        async function fetchRooms() {
          try {
            const rooms:TableData[] = await GetRooms(userData?.token);
            // console.log(rooms);
            setGames(rooms); 
          } catch (error: any) {
              if (error?.response?.status === 401) {
                  alert('Unauthorized! or Overlap logged in! please login again.')
                  console.error('Unauthorized! or Overlap logged in!');
                  dispatch(Logout())
                  removeCookie(COOKIE.name)
                  onBackdropClick()
              }else{
                  console.error('Fetch rooms failed: ', error);
              }
          }
        }
    
        if (isModalVisible) {
          fetchRooms();
        }
      }, [isModalVisible, userData?.token]);
    // const games:TableData[] = [
    //     {
    //         gameType: "FRIENDCARDGAME",
    //         owner: {
    //             id: "65ba266ea63fef0e6c52eba1",
    //             username: "Polypropylene_"
    //         },
    //         maxPlayers: 4,
    //         roomName: "asdasd",
    //         isPasswordProtected: false,
    //         id: "65ba3beea63fef0e6c52ebbc",
    //         numPlayersInGame: 0
    //     },
    //     {
    //         gameType: "FRIENDCARDGAME",
    //         owner: {
    //             id: "65ba266ea63fef0e6c52eba1",
    //             username: "Polypropylene_"
    //         },
    //         maxPlayers: 4,
    //         roomName: "asdasd",
    //         isPasswordProtected: true,
    //         id: "65ba3bffa63fef0e6c52ebbf",
    //         numPlayersInGame: 0
    //     }
    // ]
    
    const handleFilterIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterId(event.target.value);
    };
    
    return (<ModalRWD
        onBackdropClick={onBackdropClick}
        isModalVisible={isModalVisible}
        header1=''
        header2=''
        message=' '
        content = {
            <div className='lobbylist'> 
                 <CustomTable headers={lobbyTableHeaders} data={games.filter(game => game.id.includes(filterId))} onFilterIdChange={handleFilterIdChange}/>
            </div>
        }
    />)
}

export default LobbyModal