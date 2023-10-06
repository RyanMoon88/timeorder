import React, { useState, useEffect } from 'react';
import { Row, Card, CardTitle, Label, FormGroup, Button,  Alert } from 'reactstrap';
import { NavLink,useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { Formik, Form, Field } from 'formik';
import { NotificationManager } from '../../components/common/react-notifications';

import { loginUser } from '../../redux/actions';
import { Colxx } from '../../components/common/CustomBootstrap';
import IntlMessages from '../../helpers/IntlMessages';
import axios from 'axios';
import { API_SERVER_URL } from '../../constants';
import loginTitle from './TimeOrderLogin.png';
import mainTimeOrder from './mainTimeOrder.png';

import { adminRoot } from "../../constants/defaultValues";
import { useGlobalState } from './state';
import moment from 'moment';

// functionZone
function loadData(id, pwd){
  return new Promise((resolve,reject) => {
    let paramData = {email:id,password:pwd};
    console.log(id);
    console.log(pwd);
    axios({
      "url": API_SERVER_URL + "/admin/getLogin",
      "method":"post",
      "data":paramData
    }).then(function(response){
      resolve(response);
      console.log(response);
    }).catch(function(e){
      NotificationManager.error(
        '정보가 옳바르지 않습니다.',
        '이메일과 비밀번호를 입력해주세요.',
        5000,
        () => {
          // alert('callback');
        },
        null,
      );
        return;
    });
  });
}


const validatePassword = (value) => {
  let error;
  if (!value) {
    error = 'Please enter your password';
  } else if (value.length < 4) {
    error = 'Value must be longer than 3 characters';
  }
  return error;
};

const validateEmail = (value) => {
  let error;
  if (!value) {
    error = 'Please enter your email address';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    error = 'Invalid email address';
  }
  return error;
};

const Login = ({ history2, loading, error, loginUserAction }) => {
  // const [login, setLogin] = useGlobalState('login');
  const history = useHistory();
  const [id, setId] = React.useState(null);
  const [pwd, setPwd] = React.useState(null);

  const doSetId = (event) => {
    setId(event.target.value)
  }

  const doSetPwd = (event) => {
    setPwd(event.target.value)
  }


  const doLogin = (tmpPwd) => {
    console.log("@@@@@@@@@@@@@@@@@");
    let sha256 = require('js-sha256');
    let cryptoPwd = null;
    if (tmpPwd === undefined) {
      if(id === undefined){
        NotificationManager.error(
          '정보가 옳바르지 않습니다.',
          '이메일과 비밀번호를 입력해주세요.',
          5000,
          () => {
            // alert('callback');
          },
          null,
        );
          return;
      }
    }
    if(tmpPwd !== undefined){
      cryptoPwd = sha256(tmpPwd);
    }else {
      if (pwd !== "") {
        cryptoPwd = sha256(pwd);
      }
      else {        
        NotificationManager.error(
          '정보가 옳바르지 않습니다.',
          '이메일과 비밀번호를 입력해주세요.',
          5000,
          () => {
            // alert('callback');
          },
          null,
        );
          return;
      }
    }

    loadData(id, cryptoPwd).then((response) => {
      let admin = response.data;
      let after6hour = moment().add("6", "h").format("YYYYMMDDHHmmss");
      localStorage.clear();
      if(admin.length !== null && admin !== ""){
        localStorage.setItem(
          "timeOrderStoreAdminInfo",
          JSON.stringify(admin)
        )

        localStorage.setItem(
          "timeOrderStoreAdminExpireTime",
          after6hour
        )

        // setLogin(admin);
        history.push(`${adminRoot}/pages/product/store-store-details-alt`);
        window.location.reload(true);
      }else{
        NotificationManager.error(
          '정보가 옳바르지 않습니다.',
          '이메일과 비밀번호를 확인해주세요.',
          5000,
          () => {
            // alert('callback');
          },
          null,
        );
          return;
      }

    });
  }

  const [email] = useState('');
  const [password] = useState('');

  useEffect(() => {
    if (error) {
      NotificationManager.warning(error, 'Login Error', 3000, null, null, '');
    }
  }, [error]);

  const onUserLogin = (values) => {
    if (!loading) {
      if (values.email !== '' && values.password !== '') {
        loginUserAction(values, history);
      }
    }
  };
  const margin={marginTop: "11%"}
  const initialValues = { email, password };

  return (
    <Row className="h-100" style={margin}>
      <Colxx xxs="12" md="10" className="mx-auto my-auto" >
        <Card className="auth-card">
          <div className="position-relative image-side">
            {/* <img src={mainTimeOrder} /> */}
            <p className="text-white h2"></p>
            <p className="white mb-0">
            
              <br />
              <br />
              <br />
             {' '}
              <NavLink to="/user/register" className="white">
               
              </NavLink>
              <br />
              <br />
            </p>
          </div>
          <div className="form-side">
            {/* <NavLink to="/" className="white">
              <span className="logo-single" />
            </NavLink> */}
            <Colxx xxs="12" md="4" className="mx-auto my-auto" >
            <img src={loginTitle} width='100%'/>
            </Colxx>
            {/* <CardTitle className="mb-4">
              <IntlMessages id="user.login-title" />
            </CardTitle> */}
            <br></br><br></br><br></br><br></br>
            <Formik initialValues={initialValues} onSubmit={onUserLogin}>
              {({ errors, touched }) => (
                <Form className="av-tooltip tooltip-label-bottom">
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="userId" />
                    </Label>
                    <Field
                      className="form-control"
                      id="email"
                      name="email"
                      validate={validateEmail}
                      autoComplete="email"
                      autoFocus
                      required
                      onBlur= { doSetId}
                    />
                    {errors.email && touched.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup className="form-group has-float-label">
                    <Label>
                      <IntlMessages id="user.password" />
                    </Label>
                    <Field
                      className="form-control"
                      required
                      id="password"
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      onBlur={ doSetPwd }
                      onKeyUp={ (event) => { if (event.keyCode === 13) { doSetPwd(event); doLogin(event.target.value) } } }
                      validate={validatePassword}
                    />
                    {errors.password && touched.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                  </FormGroup>
                  <div className="d-flex justify-content-between align-items-center">
                    {/* <NavLink to="/user/forgot-password">
                      <IntlMessages id="user.forgot-password-question" />
                    </NavLink> */}
                    <Button
                      variant="contained"
                      color="danger"
                      onClick={ () => doLogin() }
                      className={`btn-shadow btn-multiple-state ${
                        loading ? 'show-spinner' : ''
                      }`}
                      size="lg"
                    >
                      <span className="spinner d-inline-block">
                        <span className="bounce1" />
                        <span className="bounce2" />
                        <span className="bounce3" />
                      </span>
                      <span className="label">
                        <IntlMessages id="user.login-button" />
                      </span>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
};
const mapStateToProps = ({ authUser }) => {
  const { loading, error } = authUser;
  return { loading, error };
};

export default connect(mapStateToProps, {
  loginUserAction: loginUser,
})(Login);
