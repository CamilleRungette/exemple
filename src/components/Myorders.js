import React, { Component } from "react"
import Navbar from '../components/Navbar2'
import Footer from '../components/Footer'
import DateFormat from '../components/function'
import {Card, Button} from 'react-bootstrap'
import { connect } from 'react-redux';
import {Redirect, Link} from 'react-router-dom'
import ip from './ip'
import '../App.css'

 
class MyOrders extends Component{
  constructor(){
    super();
    this.state={
      myOrders: [],
      myPersoOrders: [],
    }
  }
  componentDidMount(){
    console.log(this.props.user)
    let ctx = this;
    fetch(`${ip}/users/myorders?id=${this.props.user._id}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data){
      ctx.setState({myOrders: data.myOrders, myPersoOrders: data.myPersoOrders})
      console.log(ctx.state.myPersoOrders)
    })
    .catch(function(error) {
      console.log('Request failed ->', error)
  });


  }


  render(){
    if (this.props.connected === false || this.props.connected === null){
      return <Redirect to="/" />
    }else if (this.state.myOrders.length === 0 && this.state.myPersoOrders.length === 0) {
      return(
        <div>
          <Navbar />
          <div style={{fontFamily:"Open Sans", minHeight:"85vh"}}>
          <div style={{height:"7em"}}></div>
              <h1 style={{textAlign:"center", marginTop:"0.5em"}}>Mes Commandes</h1>
            <div style={{height:"8em"}}></div>

          <div style={{fontSize:"2em", textAlign:"center"}}>
            <p>Tu n'as passé aucune commande </p>
           <Link to="/"><Button style={{backgroundColor:"#1B263B"}}> Retour</Button> </Link>
          </div>

          </div>
          <Footer />
        </div>
      )

        } else {
      return(
      <div style={{fontFamily:"Open Sans "}}>
        <Navbar/>
        {this.state.myOrders.length === 0?(
          <div></div>
        ):(
          <div>

            
        <div style={{height:'7em'}}></div>
          <h1 style={{textAlign:"center", marginTop:'0.5em'}}>Mes Commandes</h1>
        <div style={{height:'8em'}}></div>

        {this.state.myOrders.map((order, i)=>(
        <Card className="col-8 mx-auto" style={{minWidth:'30em' }} >
          <Card.Body  >
            <Card.Title><h2>Commande du {DateFormat(order.date)} </h2></Card.Title>
            <Card.Subtitle className="mb-2 text-muted"># {order._id} </Card.Subtitle>
            <Card.Text>
              <h4>Détails de la commande: </h4>
              {order.items.map((item,i)=>(
              <div>
                <Card style={{ width:'100%'}}>
                  <div style={{display:"flex"}}>
                  <Card.Img  variant="top" className="my-auto" style={{width:'12em', maxHeight:'14em', display:'flex',}} src={item.photo} />
                  <Card.Body style={{display:"flex", flexDirection:"column", justifyContent:"center", marginLeft:"2em"}}>
                    <Card.Title style={{fontSize:'1.5em', textDecoration:"underline"}}>{item.name}</Card.Title>
                    <Card.Text>
                      {item.description} <br/>
                      {item.price} €
                    </Card.Text>
                  </Card.Body>
                  </div>
                </Card>              
                </div>
              ))}
              <br/>
              <h4 style={{textAlign:"center"}}>Total: {order.total} €</h4>
            </Card.Text>
          </Card.Body>
        </Card>
        ))}

      </div>
      )}

      
      {this.state.myPersoOrders.length === 0 ?(
        <div></div>
      ):(

        <div>
        <div style={{height: "7em"}}></div>
        <div style={{height: "7em"}}></div>
              <h1 style={{textAlign:"center"}}>Mes Commandes personnalisées</h1>
        <div style={{height:'8em'}}></div>

        {this.state.myPersoOrders.map((order, i)=>(
        <Card className="col-8 mx-auto" style={{margin:"5em", minWidth:'30em' }} >
          <Card.Body  >
            <Card.Title><h2>Commande du {DateFormat(order.date)} </h2></Card.Title>
            <Card.Subtitle className="mb-2 text-muted"># {order._id} </Card.Subtitle>
            <Card.Text>
              <h4>Détails de la commande: </h4>
              <div>
                <Card style={{ width:'100%'}}>
                  <div style={{display:"flex"}}>
                    {order.photo !== "" ?(
                      <Card.Img  variant="top" className="my-auto" style={{width:'12em', maxHeight:'14em', display:'flex',}} src={order.photo} />
                    ):(
                      <div className="col-1"></div>
                    )}
                    <div>
                      <Card.Body style={{display:"flex", flexDirection:"column", justifyContent:"center", marginLeft:"2em"}}>
                        <Card.Text>
                          {order.description} <br/><br/>
                          {order.paid === false?(
                            <Link to="/checkout"  style={{fontSize:"1.2em", color:"#365182", fontWeight:"bold"}} onClick={()=> this.props.onOrderClick(order)}>À payer</Link>
                            ):(
                              <p>Payée</p>
                              )}
                        </Card.Text>
                      </Card.Body>
                      </div>
                    </div>
                </Card>              
                </div>
              <br/>
              <h4 style={{textAlign:"center"}}>Total: {order.total} €</h4>
            </Card.Text>
          </Card.Body>
        </Card>
        ))}
        </div>
        )}


        <div style={{height:'5em'}}></div>
        <Footer />
      </div>
    )
  }
}}

function mapStatetoProps(state){
  return  {connected: state.user.isUserExist,
          user: state.user.userSigned,
          }
}

function mapDispatchToProps(dispatch){
  console.log("===============++>", dispatch)
  return{
    onOrderClick: function(order){
      console.log("coucou")
      dispatch({type: 'payPersoOrder', persoOrder: order})
    }
  }
}


export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(MyOrders);
