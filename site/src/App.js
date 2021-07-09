import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Loadable from 'component/Loadable'
import NavWrapper from 'component/NavWrapper'

class App extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Router>
				<Switch>
					<Route path='/' render={() => (
						<div className='app-root'>
							<NavWrapper>
								<Switch>
                  <Route exact path='/'      component={Loadable({loader:()=>import('./app/login')})} />
                  <Route exact path='/listS' component={Loadable({loader:()=>import('./app/listDataS')})} />
                  <Route exact path='/listT' component={Loadable({loader:()=>import('./app/listDataT')})} />
                  <Route exact path='/listM' component={Loadable({loader:()=>import('./app/listDataM')})} />
                  <Route exact path='/lib'   component={Loadable({loader:()=>import('./app/lib')})} />
                </Switch>
							</NavWrapper>
						</div>
					)}/>
				</Switch>
			</Router>
		)
	}
}

export default App
