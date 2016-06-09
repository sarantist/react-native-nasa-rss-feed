/**
 * Simple NASA Rss Reader
 */
 
var DOMParser = require('xmldom').DOMParser;
var REQUEST_URL = "http://www.nasa.gov/rss/dyn/breaking_news.rss";
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');
var Button = require('react-native-button');

import React, {
  Component,
} from 'react';
import {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  StatusBar,
  Text,
  View,
  ToolbarAndroid,
  TouchableHighlight,
  BackAndroid,
  Navigator,
  ScrollView,
  WebView,
} from 'react-native';



StatusBar.setBackgroundColor('#9598A6', true);
class helloReact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      url: ''
    };
  }

  componentDidMount() {
    this.fetchData();
      BackAndroid.addEventListener('hardwareBackPress', () => {
        if (this.refs.navigator.getCurrentRoutes().length === 1  ) {
           return false;
        }
        
        this.refs.navigator.pop();
        return true;
      });
  }

  extractData (text) {
    var doc = new DOMParser().parseFromString(text, 'text/xml');
    var items_array = [];
    var items = doc.getElementsByTagName('item');

    for (var i=0; i < items.length; i++) {
      items_array.push({
        title: items[i].getElementsByTagName('title')[0].lastChild.data,
        description: items[i].getElementsByTagName('description')[0].lastChild.data,
        thumbnail: items[i].getElementsByTagName('enclosure')[0].getAttribute('url'),
        link: items[i].getElementsByTagName('link')[0].textContent,
        date: items[i].getElementsByTagName('pubDate')[0].textContent,                    
      })
    }
	
    return items_array;
  }

  fetchData() {
    fetch(REQUEST_URL)
      .then((response) => response.text())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.extractData(responseData))
        });
      }).done();
  }

  render() {
    var initialRoute = {name: 'list'};
    return (
      <Navigator ref="navigator"
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FloatFromRight}
        renderScene={this.RouteMapper.bind(this)}
      />
    );
  }

  RouteMapper(route, navigator) {
    if(route.name == 'list') {
      return (
      <View style={styles.view}  navigator={navigator}>
          <ToolbarAndroid style={styles.toolbar}
             title={"Breaking News"}
             titleColor={'#FFFFFF'}/>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderFeed.bind(this)}
            style={styles.listView}
            list={route.list}/>
        </View>
      );
    }

    if(route.name == 'details') {
       return (
      <View style={styles.view} navigator={navigator}>
          <ToolbarAndroid style={styles.toolbar}
            title={"Breaking News"}
            titleColor={'#FFFFFF'}/>
        <ScrollView style={styles.scrollView}> 
          <Image
            source={{uri: route.feed_data.thumbnail}}
            style={styles.fullImage}/>
            <View style={styles.textContainer}>
              <Text style={styles.descriptionText}>{route.feed_data.description}</Text>
              <Text style={styles.date}>{route.feed_data.date}</Text>
            </View>
            <Button
              style={{borderWidth: 1, borderColor: 'blue'}}
              onPress={() => this.goToUrl(route.feed_data)}>
              Read More..
            </Button>
        </ScrollView>
        </View>
      );
    }

    return (
      <WebView navigator={navigator}
      url={this.state.url}/>
    );
  }

  goToUrl(feed_data) {
    this.setState({url: feed_data.link});
    this.refs.navigator.push({
      name: 'webview'
    })
  }

  _pressRow(selected_feed) {
    this.refs.navigator.push({
      name: 'details',
      feed_data: selected_feed
    })
  }

  renderFeed(feed) {
    return (
      <TouchableHighlight onPress={() => this._pressRow(feed)}>
        <View style={styles.container}>
          <Image
            source={{uri: feed.thumbnail}}
            style={styles.thumbnail}/>
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{feed.title}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    padding: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  rightContainer: {
    flex: 1,
    marginLeft: 10
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 150,
    height: 150
  },
  listView: {
    backgroundColor: '#000000',
    flex:1,
  },
  view: {
    backgroundColor: '#000000',
  	flex:1
  },
  textContainer: {
    padding: 10
  },
  toolbar: {
    backgroundColor: '#9598A6',
    height: 56,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 20
  },
  descriptionText: {
    fontSize: 20,
    color: '#FFFFFF'
  },
  date: {
    marginTop: 20,
    textAlign: 'center',
    color: '#FF1422'
  },
  fullImage: {
    width: windowSize.width,
    height: 300,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  scrollView: {
    flex:1
  }
});


AppRegistry.registerComponent('helloReact', () => helloReact);



    