import React, { Component } from "react";
import PropTypes from "prop-types";
import { propTypes, reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import compose from "recompose/compose";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
 
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";

import { Notification, translate, userLogin } from "react-admin";

import { lightTheme } from "./themes";
import { webUrl } from "../config";
import { CardContent } from "@material-ui/core";

const styles = theme => ({
  main: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "flex-start",
    background: "url(https://source.unsplash.com/random/1600x900/daily)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  },
  card: {
    minWidth: 300,
    marginTop: "6em"
  },
  logo: {
    fontWeight: "300",
    textAlign: "center",
    color: theme.palette.secondary.main
  },
  verticalMargin: {
    margin: "1em 0"
  },
  button: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline",
    margin: 0,
    padding: 0,
    "&:hover": {
      textDecoration: "underline"
    },
    "&:focus": {
      textDecoration: "underline"
    }
  }
});

// see http://redux-form.com/6.4.3/examples/material-ui/
const renderInput = ({
  meta: { touched, error } = {},
  input: { ...inputProps },
  ...props
}) => (
  <TextField
    error={!!(touched && error)}
    helperText={touched && error}
    {...inputProps}
    {...props}
    fullWidth
    labe
  />
);

class Login extends Component {
  login = auth =>
    this.props.userLogin(
      auth,
      this.props.location.state ? this.props.location.state.nextPathname : "/"
    );

  render() {
    const { classes, handleSubmit, isLoading, translate } = this.props;
    return (
      <div className={classes.main}>
        <Card className={classes.card}>
          <CardContent>
            <Typography
              className={classes.logo}
              variant="display3"
              color="primary"
            >
              SEMA Admin
            </Typography>
            <form onSubmit={handleSubmit(this.login)}>
              <div className={classes.verticalMargin}>
                <Field
                  autoFocus
                  name="email"
                  component={renderInput}
                  label={"Email"}
                  disabled={isLoading}
                />
              </div>

              <div className={classes.verticalMargin}>
                <Field
                  name="password"
                  component={renderInput}
                  label={"Password"}
                  type="password"
                  disabled={isLoading}
                />
              </div>

              <Button
                variant="raised"
                type="submit"
                color="primary"
                disabled={isLoading}
                fullWidth
              >
                {isLoading && <CircularProgress size={25} thickness={2} />}
                {translate("ra.auth.sign_in")}
              </Button>
            </form>

            <div className={classes.verticalMargin}>
              {/* <a href={`${webUrl}/forget`} className={classes.button}>
                <Typography variant="caption">Forgot password?</Typography>
              </a> */}
            </div>
          </CardContent>
        </Card>
        <Notification />
      </div>
    );
  }
}

Login.propTypes = {
  ...propTypes,
  authProvider: PropTypes.func,
  classes: PropTypes.object,
  previousRoute: PropTypes.string,
  translate: PropTypes.func.isRequired,
  userLogin: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ isLoading: state.admin.loading > 0 });

const enhance = compose(
  translate,
  reduxForm({
    form: "signIn",
    validate: (values, props) => {
      const errors = {};
      const { translate } = props;
      if (!values.email) {
        errors.email = translate("ra.validation.required");
      }
      if (!values.password) {
        errors.password = translate("ra.validation.required");
      }
      return errors;
    }
  }),
  connect(
    mapStateToProps,
    { userLogin }
  ),
  withStyles(styles)
);

const EnhancedLogin = enhance(Login);

// We need to put the MuiThemeProvider decoration in another component
// Because otherwise the withStyles() HOC used in EnhancedLogin won't get
// the right theme
const LoginWithTheme = props => (
  <MuiThemeProvider theme={createMuiTheme(lightTheme)}>
    <EnhancedLogin {...props} />
  </MuiThemeProvider>
);

export default LoginWithTheme;
