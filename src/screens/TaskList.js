import React, { Component } from 'react'
import { View, Alert, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Plataform, Platform } from 'react-native'
import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'


import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import AsyncStorage from "@react-native-community/async-storage"
import commonStyles from '../commonStyles'
import Task from '../components/Task'
import AddTask from './AddTask'
import axios from 'axios'
import { sever, showError } from '../common'
const initialState = {
    showDoneTasks: true,
    showAddTask: false,
    visibleTasks:[],
    tasks: []

}
export default class TaskList extends Component {
    state = {
        ...initialState
    }
    
    componentDidMount = async () => { // método de ciclo de vida
        const stateString = await AsyncStorage.getItem('tasksState')
        const savedState =  JSON.parse(stateString) || initialState
        this.setState({
            showDoneTasks: savedState.showDoneTasks
        }, this.filterTasks)

        this.loadTasks()
    }

    loadTasks = async () =>{
        try{
            const maxDate = moment()
                .add({ days: this.props.daysAhead})
                .format('YYYY-MM-DD 23:59:59')
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            this.setState({ tasks: res.data }, this.filterTasks)
        }catch(e){
            showError(e)
        }
    }
    
    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks}, this.filterTasks)
    }
    
    filterTasks = () => {
        let visibleTasks = null
        if(this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        }else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }

        this.setState({ visibleTasks })
        AsyncStorage.setItem('tasksState', JSON.stringify({
            showDoneTasks: this.state.showDoneTasks
        }))
    }
    
    
    
    toggleTask = taskId => {
        try {
            await axios.put(`${server}/tasks/${taskId}/toggle`)
            this.loadTasks()
        }catch(e){
            showError(e)
        }
    }

    addTask = async newTask => {
        if(!newTask.desc || !newTask.desc.trim()){
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return
        }
         
        try {
            await axios.post(`${server}/tasks`,{
                desc: newTask.desc,
                estimateAt: newTask.date
            })

            this.setState({  showAddTask: false }, this.loadTasks)
        }catch(e){
            showError(e)
        }

    }
      
    deleteTask = async taskId => {
        try{
            await axios.delete(`${server}/tasks/${taskId}`)
            this.loadTasks()
        }catch(e){
            showError(e)
        }
    }

    getImage = () => {
        switch(this.props.daysAhead){
            case 0: return todayImage
            case 1: return tomorrowImage
            case 7: return weekImage
            default: return monthImage
        }
    }
    
    getColor = () => {
        switch(this.props.daysAhead){
            case 0: return commonStyles.today
            case 1: return commonStyles.tomorrow
            case 7: return commonStyles.week
            default: return commonStyles.month
        }
    }
    
    render(){
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container} >
                    <ImageBackground source={this.getImage()} 
                    style={styles.image}> 
                    <AddTask isVisible={this.state.showAddTask}
                        onCancel={() => this.setState({ showAddTask: false })}
                        onSave={this.addTask} />
                        <View style={styles.iconBar}>
                            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                                <Icon name={'bars'}
                                size={20} color={commonStyles.colors.secondary}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.toggleFilter}>
                                <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                                size={20} color={commonStyles.colors.secondary}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.titleBar}>
                        <Text style={styles.title}>{this.props.title}</Text>
                                <Text style={styles.subtitle}>{today}</Text>
                        </View>
                    </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.visibleTasks}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({item}) => <Task {...item}
                        onToggleTask={this.toggleTask}
                        onDelete={this.deleteTask}/>}/>
                </View>
                    <TouchableOpacity  style={[styles.addButton, { backgroundColor: this.getColor()}]} onPress={() => this.setState({showAddTask: true})}
                        activeOpacity={0.7}>
                        
                        <Icon name='plus' color={commonStyles.colors.secondary} size={20}></Icon>                  
                    </TouchableOpacity>
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
    },
    titleBar:{
        flex: 1,
        justifyContent:'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 20
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },
    addButton: {
        position: 'absolute',      
        bottom: 30,
        right:30,
        height: 50,
        width:50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',

    }    
})