import {ChildProcessWithoutNullStreams, spawn} from "child_process";
import * as path from 'path';

const currentFilePath = new URL(import.meta.url).pathname;
const currentDirectory = path.dirname(currentFilePath);
const joinedPath = path.join(currentDirectory, "AIInterface", "script.py");
const scriptPath = TrimLeadingBackSlash(joinedPath)
const scriptPathWithDoubleBackSlashes = scriptPath.replace(/\\/g, '\\\\');

export function BotAuction(cardInHandArray: number[], currentBid: number, botDifferenceNumber: number): Promise<string> {
    const python: ChildProcessWithoutNullStreams = spawn('python', [
        scriptPathWithDoubleBackSlashes
        , 'bidding'
        , JSON.stringify(cardInHandArray)
        , currentBid.toString()
        , botDifferenceNumber.toString()
    ]);
    return PythonListener(python)
}
export function BotSelectTrumpSuit(cardInHandArray: number[], botDifferenceNumber: number): Promise<string>{
    const python: ChildProcessWithoutNullStreams = spawn('python', [
        scriptPathWithDoubleBackSlashes
        , 'calculateTrumpsuite'
        , JSON.stringify(cardInHandArray)
        , botDifferenceNumber.toString()
    ]);
    return PythonListener(python)
}
export function BotSelectFriendCard(cardInHandArray: number[]): Promise<string>{
    const python: ChildProcessWithoutNullStreams = spawn('python', [
        scriptPathWithDoubleBackSlashes
        , 'calculateFriendCard'
        , JSON.stringify(cardInHandArray)
    ]);
    return PythonListener(python)
}

export function BotPlayCard(cardInHandArray: number[], stateArray: number[], botDifferenceNumber: number): Promise<string> {
    const python: ChildProcessWithoutNullStreams = spawn('python', [
        scriptPathWithDoubleBackSlashes
        ,'dropCard'
        , JSON.stringify(cardInHandArray)
        , JSON.stringify(stateArray)
        , botDifferenceNumber.toString()
    ]);
    return PythonListener(python)
}
function PythonListener(python: ChildProcessWithoutNullStreams): Promise<string>{
    return new Promise((resolve, reject) => {
        let dataToSend: string = '';
        python.stdout.on('data', function (data) {
            // console.log('Pipe data from python script ...');
            dataToSend = data.toString();
        });
        python.on('close', (code) => {
            if(code === 0){
                resolve(dataToSend);
            }
            else{
                console.log(`child process close all stdio with code ${code}`);
                reject(dataToSend);
            }
        });
    })
}
function TrimLeadingBackSlash(str: string): string {
    return str.replace(/^\\+/, '');
}