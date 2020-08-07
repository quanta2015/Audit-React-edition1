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
                  <Route exact path='/' component={Loadable({ loader: () => import('./app/login')})}  />
                  
                  <Route exact path='/listDataS' component={Loadable({ loader: () => import('./app/listDataS')})}  />
                  <Route exact path='/listDataT' component={Loadable({ loader: () => import('./app/listDataT')})}  />
                  <Route exact path='/listDataM' component={Loadable({ loader: () => import('./app/listDataM')})}  />
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
