import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import todayImage from '../../assets/imgs/today.jpg'

export default class TaskList extends Component {
    render(){
        return (
            <View style={styles.container} >

                <View style={styles.image}>
                    <ImageBackground source={todayImage} style={styles.image}> 
                    </ImageBackground>
                </View>

                <View style={styles.taskList}>
                    <Text>TaskList</Text>
                </View>

            </View>

        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    image:{
        flex:3
    },
    taskList:{
        flex:7
    }
})