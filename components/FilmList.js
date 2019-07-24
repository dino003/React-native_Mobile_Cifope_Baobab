import React from 'react'
import {StyleSheet, FlatList} from 'react-native'
import FilmItem from './filmItems'
import {connect} from 'react-redux'

class FilmList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            films: []
        }
    }

    _detailFilm = (idFilm) => {
        // console.log("film id = " + idFilm)
         this.props.navigation.navigate("FilmDetail", {idFilm: idFilm})
     }

     render(){
       console.log(this.props.navigation)
         return (
             <FlatList 
             style={styles.list}
             data={this.props.films}
             extraData={this.props.favoriteFilms}
             keyExtractor={(item) => item.id.toString()}
             renderItem={({item}) => (
               <FilmItem
                 film={item}
                 isFilmFavorite={(this.props.favoriteFilms.findIndex(film => film.id === item.id) !== -1) ? true : false}
                 showFilm={this._detailFilm}
               />
             )}
             onEndReachedThreshold={0.5}
             onEndReached={() => {
               if (!this.props.favoriteList && this.props.page < this.props.totalPages) {
                 // On appelle la méthode loadFilm du component Search pour charger plus de films
                 this.props.loadFilms()
               }
             }}
             />
         )
     }
}

const styles = StyleSheet.create({
    list: {
      flex: 1
    }
  })
  
  const mapStateToProps = state => {
    return {
      favoriteFilms: state.toggleFavorite.favoriteFilms
    }
  }
  
  export default connect(mapStateToProps)(FilmList)