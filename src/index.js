/* eslint-disable */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';
import firebase from '../src/firebase'; // Import Firebase
// import 'firebase/auth';

const App = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
			if (firebaseUser) {
				setUser(firebaseUser);
			} else {
				setUser(null);
			}
		});
		return () => unsubscribe();
	}, []);

	return (
		<ChakraProvider theme={theme}>
			<React.StrictMode>
				<ThemeEditorProvider>
					<Router>
						<Switch>
							{user ? (
								<Route path="/" component={AdminLayout} />
							) : (
								<Route path="/auth" component={AuthLayout} />
							)}
							<Redirect to={user ? "/" : "/auth"} />
						</Switch>
					</Router>
				</ThemeEditorProvider>
			</React.StrictMode>
		</ChakraProvider>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
