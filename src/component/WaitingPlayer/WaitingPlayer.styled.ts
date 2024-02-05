import styled from 'styled-components'

export const AddBotButton = styled.button`
  //Button
  cursor: pointer;
  margin-top: -10px;
  margin-bottom: 25px;
  border: 3px solid white;
  border-radius: 30px;
  background: #162345;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 10px;
  max-width: 300px;
  min-height: 70px;
  max-height: 80px;
  padding: 8px 16px;
  //Text
  color: #FFF;
  text-align: center;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  &:hover {
    color: #375FC7;
    background-color: #081128;
    border-color: white;
  }
`;

