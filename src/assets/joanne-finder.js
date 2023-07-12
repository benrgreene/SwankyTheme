const state = {
  pageOn: 1,
  stateName: 'savedflannels'
}

const fetchPage = (page = 1) => {
  fetch(`https://plusdevelopment.joann.com/browse/group_id/flannel-fabric?c=ciojs-client-2.34.4&key=key_fK2WulL7gXMcQ4UC&i=aeb10f3f-fb23-42f9-b9d7-a2f9105f7245&s=1&page=${page}&num_results_per_page=40&filters[IsDisplayableOnSite]=True&sort_by=daysOnline&sort_order=ascending`)
    .then((b) => b.json())
    .then((results) => {
      Alpine.store('fabricStore').setFabricResults(results.response.results);
      state.pageOn += 1;
    });
}

document.addEventListener('alpine:init', () => {
  Alpine.store('fabricStore', {
    fabrics: [],
    savedFlannels: [],
    pane: 'search',
    setSavedFlannels (flannels) {
      this.savedFlannels = flannels;
    },
    setFabricResults (newFabrics) {
      this.fabrics = [...this.fabrics, ...newFabrics];
    },
    setPane (newPane) {
      this.pane = newPane;
    }
  });

  const savedItemsRaw = localStorage.getItem(state.stateName) || false;
  const savedItems = savedItemsRaw ? JSON.parse(savedItemsRaw) : [];
  Alpine.store('fabricStore').setSavedFlannels(savedItems);
});

document.addEventListener('DOMContentLoaded', () => {
  fetchPage();
});

window.loadMoreFabrics = () => {
  fetchPage(state.pageOn);
};

window.toggleInSavedItems = (newItem) => {
  const savedItemsRaw = localStorage.getItem(state.stateName) || false;
  const savedItems = savedItemsRaw ? JSON.parse(savedItemsRaw) : [];
  const foundItem = savedItems.findIndex((item) => {
    return item.data.ID === newItem.data.ID;
  });

  if (foundItem === -1) {
    savedItems.push(newItem);
  } else {
    savedItems.splice(foundItem, 1);
  }

  Alpine.store('fabricStore').setSavedFlannels(savedItems);
  localStorage.setItem(state.stateName, JSON.stringify(savedItems));
}

window.getButtonText = (toFind) => {
  return Alpine.store('fabricStore').savedFlannels.findIndex((item) => {
    return toFind.data.ID === item.data.ID;
  }) === -1 ? 'Save' : 'Remove';
};