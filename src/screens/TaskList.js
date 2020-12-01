import React, { Component } from 'react'
import { View, Alert, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Plataform, Platform } from 'react-native'
import todayImage from '../../assets/imgs/today.jpg'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'
import commonStyles from '../commonStyles'
import Task from '../components/Task'
import AddTask from './AddTask'
export default class TaskList extends Component {
    state = {
        showDoneTasks: true,
        showAddTask: false,
        visibleTasks:[],
        tasks: [
            {
            id: Math.random(),
            desc: 'Comprar Livro de React Native',
            estimateAt: new Date(),
            doneAt: new Date(),
        },
        {
            id: Math.random(),
            desc: 'Ler livro de React Native',
            estimateAt: new Date(),
            doneAt: null,
        }
        ]
    }
    
    componentDidMount = () => { // método de ciclo de vida
        this.filterTasks()
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
    }
    
    
    
    toggleTask = taskId => {
        const tasks = [...this.state.tasks]
        tasks.forEach(task =>{
            if(task.id === taskId){
                task.doneAt = task.doneAt ? null : new Date()
            }
        })

        this.setState({ tasks }, this.filterTasks)
    }

    addTask = newTask => {
        if(!newTask.desc || !newTask.desc.trim()){
            Alert.alert('Dados Inválidos', 'Descrição não informada!')
            return
        }
         
        const tasks = [...this.state.tasks]
        tasks.push({
            id: Math.random(),
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt: null
        })

        this.setState({ tasks, showAddTask: false }, this.filterTasks)
    }
    
    render(){
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container} >
                    <ImageBackground source={todayImage} 
                    style={styles.image}> 
                    <AddTask isVisible={this.state.showAddTask}
                        onCancel={() => this.setState({ showAddTask: false })}
                        onSave={this.addTask} />
                        <View style={styles.iconBar}>
                            <TouchableOpacity onPress={this.toggleFilter}>
                                <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                                size={20} color={commonStyles.colors.secondary}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.titleBar}>
                                <Text style={styles.title}>Hoje</Text>
                                <Text style={styles.subtitle}>{today}</Text>
                        </View>
                    </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.visibleTasks}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({item}) => <Task {...item}
                        toggleTask={this.toggleTask}/>}/>
                </View>
                    <TouchableOpacity  style={styles.addButton} onPress={() => this.setState({showAddTask: true})}
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
        justifyContent: 'flex-end',
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },
    addButton: {
        position: 'absolute',      
        bottom: 30,
        right:30,
        height: 50,
        width:50,
        backgroundColor: '#b13b44',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',

    }    
})