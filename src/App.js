import { BrowserRouter as Router , Switch , Route} from 'react-router-dom'
import MainPage from './pages/main';
import MatchPage from './pages/match';
import styles from './styles.module.scss'
import SignUp from './components/signup';
import { useEffect } from 'react';
import {io} from 'socket.io-client'
import {useSelector} from 'react-redux'




function App() {
  const playerName = useSelector(state => state.user.name)
  useEffect(() => {
    io()
  } , [])

  return (
    <div className={styles.main}>
      {playerName ?  <Router>
        <Switch>
          <Route exact path='/' component={MainPage} />
          <Route path='/match/:id' component={MatchPage} />
        </Switch>
      </Router> : <SignUp />}
     
    </div>
  );
}

export default App;
