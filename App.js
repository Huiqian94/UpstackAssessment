import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Button
} from "react-native";
import CompleteFlatList from 'react-native-complete-flatlist';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// get data from this URL!
const repoURL = "https://api.github.com/orgs/react-native-community/repos?per_page=10&";

const App = () => {
  // managing state with 'useState'
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modalInfo, setModalInfo] = useState({});
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true);
  const [page, setPage] = useState(1);

  // similar to 'componentDidMount', gets called once
  useEffect(() => {
    const finalRepoURL = `${repoURL}page=${page}`;

    fetch(finalRepoURL)
      .then((response) => response.json()) // get response, convert to json
      .then((json) => {
        const oriData = [ ...data ];
        if (oriData != null) {
          const mergeData = [ ...oriData, ...json];
          setData(mergeData);
        } else {
          setData(json);
        }
      })
      .catch((error) => alert(error)) // display errors
      .finally(() => setLoading(false)); // change loading state
  }, [page]);

  const endReached = () => {
    setPage((prevValue) => prevValue + 1);
  };

  const onRefresh = () => {
    setData([]);
    setPage(1);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={Object.keys(modalInfo).length == 0 ? false : true }
      >
        <View style={styles.centeredView} key={modalInfo.id}>
          <View style={styles.modalView}>

            <View style={{ flexDirection: 'row', alignContent: 'stretch' }}>
              <View style={styles.iconTextInlineView}>
                <FontAwesome name="bookmark" style={styles.iconPadding} />
                <Text style={{ fontWeight: 'bold', color: '#58a6ff' }}>{modalInfo.name}</Text>
              </View>
            </View>
            
            <View style={{ paddingBottom: 24 }}>
              <Text>{modalInfo.description}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignContent: 'stretch' }}>
              <View style={styles.iconTextInlineView}>
                <FontAwesome name='circle' style={styles.iconPadding} />
                <Text>{modalInfo.language}</Text>
              </View>

              <View style={styles.iconTextInlineView}>
                <FontAwesome name='star-o' style={styles.iconPadding} />
                <Text>{modalInfo.stargazers_count}</Text>
              </View>

              <View style={styles.iconTextInlineView}>
                <FontAwesome name='code-fork' style={styles.iconPadding} />
                <Text>{modalInfo.forks_count}</Text>
              </View>

              <View style={styles.iconTextInlineView}>
                <FontAwesome name='eye' style={styles.iconPadding} />
                <Text>{modalInfo.watchers_count}</Text>
              </View>
            </View>
            
            <Button
                title='OK'
                onPress={() => setModalInfo({})}
              />
          </View>
        </View>
      </Modal>
      <CompleteFlatList
        isLoading={isLoading}
        showSearch={true}
        searchKey={['name', 'description']}
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setModalInfo(item)} key={item.id}>
            <View style={styles.flatListItemStyle} key={item.id}>
              <Text style={{ fontWeight: 'bold', marginBottom: 8}}>{item.name}</Text>
              <Text>{item.description}</Text>
            </View>
          </TouchableOpacity>    
        )}
        pullToRefreshCallback={() => onRefresh()}
        onEndReached={endReached}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 48,
  },
  flatListItemStyle: {
    flex: 1,
    margin: 8,
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#58a6ff'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  iconTextInlineView: {
    paddingRight: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  iconPadding: {
    paddingRight: 4,
    paddingTop: 2,
  }
});

export default App;