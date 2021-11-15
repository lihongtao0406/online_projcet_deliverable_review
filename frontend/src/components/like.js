import React, { Component } from 'react'
 
export default class Like extends Component {
    constructor(){
        super()
        this.state={
            isLiked:true
        }
    }
    render() {
        return (
                <span onClick={this.handleLike.bind(this)}>
                    {
                    this.state.isLiked ?  '喜欢💓':'取消🖤'
                    }
                </span>
        )
    }
 
    handleLike(){
        // console.log("sss")
        //第一种修改setState方法
        // this.setState({
        //     isLiked:!this.state.isLiked
        // })
 
        //第二种prevState是上次的state
        this.setState((prevState)=>{
            console.log(prevState)
            return{
                isLiked:!prevState.isLiked
            }
        },()=>{
            console.log(this.state.isLiked) //setState回调 获取最新的状态
        })
    }
}