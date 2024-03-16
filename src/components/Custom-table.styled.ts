import styled from 'styled-components'

export const PageButton = styled.button`
  //Button
  cursor: pointer;
  border: 3px solid white;
  border-radius: 30px;
  background: #081128;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  min-height: 30px;
  padding: 8px 16px;
  transition: 0.2s ease-in-out;
  //Text
  color: #FFF;
  text-align: center;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;

  &:hover {
    color: #375FC7;
    background-color: #081128;
    border-color: white;
  }
`;
export const CreateButton = styled.button`
  //Button
  cursor: pointer;
  border: 3px solid white;
  border-radius: 30px;
  background: #081128;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  min-height: 30px;
  padding: 8px 16px;
  background-color: #04AA6D;
  transition: 0.2s ease-in-out;
  //Text
  color: #FFF;
  text-align: center;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;

  &:hover {
    color: darkgreen;
    background-color: #04AA6D;
    border-color: white;
  }
`;

export const SearchGameID = styled.input`
    /* margin-top: -10; */
    padding-left: 20px;
    margin-right: 2px;
    /* margin-bottom: 2px; */
    width: 300px;
    height: 30px;
    border: 2px solid #ffffff00;;
    border-radius: 4px;
    background-color: snow;
    color: black;
`;