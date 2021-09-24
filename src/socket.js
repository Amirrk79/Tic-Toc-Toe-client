import {io} from 'socket.io-client'
 const endPoint = 'https://obscure-oasis-54722.herokuapp.com/'

const socket = io(endPoint)

export default socket