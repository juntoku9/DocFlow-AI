import '../src/styles/theme.scss';
// import '../node_modules/bootstrap/scss/bootstrap.scss';
import ReactDOM from 'react-dom';
import App from './app';

window.process = {
    env: {
        NODE_ENV: 'development'
    }
}

ReactDOM.render(
    <App /> , document.querySelector('#root')
);
