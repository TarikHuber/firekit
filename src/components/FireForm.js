import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { initialize } from 'redux-form';
import withFirebase  from '../withFirebase';

class FireForm extends Component {

  constructor(props, context){
    super();
    this.context=context;
    console.log(context);
    this.state={
      initialized: false
    }
  }

  clean(obj){
    Object.keys(obj).forEach((key) => (obj[key] === undefined) && delete obj[key]);
    return obj
  }

  getCreateValues = (values) => {
    const { handleCreateValues } = this.props;

    if(handleCreateValues!==undefined && handleCreateValues instanceof Function){
      return handleCreateValues(values);
    }

    return values;

  }

  getUpdateValues = (values) => {
    const { handleUpdateValues } = this.props;

    if(handleUpdateValues!==undefined && handleUpdateValues instanceof Function){
      return handleUpdateValues(values);
    }

    return values;
  }


  handleSubmit =(values) => {
    const { path, uid, onSubmitSuccess, firebaseApp} = this.props;

    if(uid){
      firebaseApp.database().ref().child(`${path}${uid}`).update(this.getUpdateValues(this.clean(values))).then(()=>{
        if(onSubmitSuccess && onSubmitSuccess instanceof Function){
          onSubmitSuccess(values);
        }
      })
    }else{
      firebaseApp.database().ref().child(`${path}`).push(this.getCreateValues(this.clean(values))).then(()=>{
        if(onSubmitSuccess && onSubmitSuccess instanceof Function){
          onSubmitSuccess(values);
        }
      })
    }

  }

  handleDelete = () => {
    const { onDelete, path, uid, firebaseApp} = this.props;

    if(uid){
      firebaseApp.database().ref().child(`${path}${uid}`).remove().then(()=>{
        if(onDelete && onDelete instanceof Function){
          onDelete();
        }
      })
    }

  }

  componentDidMount(){
    const { path, uid, name, firebaseApp} = this.props;

    if(uid){
      firebaseApp.database().ref(`${path}${uid}`).on('value',
      snapshot => {
        this.setState({initialized: true}, ()=>{
          this.props.dispatch(initialize(name, snapshot.val(), true))
        })
      }
    )
  }else{
    this.setState({initialValues: {}, initialized:true})
  }

}

componentWillUnmount(){
  const { path, uid, firebaseApp} = this.props;
  firebaseApp.database().ref(`${path}${uid}`).off()
}


render() {

  const childrenWithProps = React.Children.map(this.props.children,
    (child) => React.cloneElement(child, {
      onSubmit: this.handleSubmit,
      ...this.state,
      ...this.props
    })
  );

  return (
    <div>
      {childrenWithProps}
    </div>
  );
}
}

FireForm.propTypes = {
  path: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  uid: PropTypes.string,
  onSubmitSuccess: PropTypes.func,
  onDelete: PropTypes.func,
  handleCreateValues: PropTypes.func,
  handleUpdateValues: PropTypes.func,
};


export default withFirebase(FireForm);
