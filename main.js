document.addEventListener('DOMContentLoaded', function () {
  const animes = [];
  const RENDER_EVENT = 'render-animes';

  const submitAnime = document.getElementById('inputAnime');
  submitAnime.addEventListener('submit', function (event) {
    event.preventDefault();
    addAnime();
  })

  function addAnime() {
    const inputAnimeTitle = document.getElementById('inputAnimeTitle').value;
    const inputAnimeGenre = document.getElementById('inputAnimeGenre').value;
    const inputAnimeYear = document.getElementById('inputAnimeYear').value;
    const inputAnimeIsComplete = document.getElementById('inputAnimeIsComplete').checked;

    const generatedID = generatedid();
    const animeObject = generateAnimeObject(generatedID, inputAnimeTitle, inputAnimeGenre, inputAnimeYear, inputAnimeIsComplete)
    animes.push(animeObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generatedid() {
    return +new Date();
  }

  function generateAnimeObject(id, title, genre, year, isComplete) {
    return {
      id,
      title,
      genre,
      year,
      isComplete
    }
  }

  document.addEventListener(RENDER_EVENT, function () {
    console.log(animes)
  })

    function makeAnime(animeObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = animeObject.title;

    const textGenre = document.createElement('p');
    textGenre.innerText = animeObject.genre;

    const textYear = document.createElement('p')
    textYear.innerText = 'Tahun: ' + animeObject.year;


    const article = document.createElement('article');
    article.classList.add('anime_item');
    article.append(textTitle, textGenre, textYear);

    const action = document.createElement('div');
    action.classList.add('action')
    article.append(action);

    if (animeObject.isComplete) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('green')
      undoButton.innerText = "Belum selesai di Tonton";

      undoButton.addEventListener('click', function () {
        undoAnimeFromCompleted(animeObject.id);
      })

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('red');
      deleteButton.innerText = "Hapus anime";

      deleteButton.addEventListener('click', function () {
        removeAnimeFromCompleted(animeObject.id);
      })

      action.append(undoButton, deleteButton);


    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('green');
      checkButton.innerText = "Selesai di tonton";

      checkButton.addEventListener('click', function () {
        addAnimeToCompleted(animeObject.id)
      })

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('red');
      deleteButton.innerText = "Hapus anime";

      deleteButton.addEventListener('click', function () {
        removeAnimeFromCompleted(animeObject.id);
      })
      action.append(checkButton, deleteButton);
    }


    return article;
  }

  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedANIMEList = document.getElementById('incompleteAnimeList');
    uncompletedANIMEList.innerHTML = '';

    const completedANIMEList = document.getElementById('completeAnimeList');
    completedANIMEList.innerHTML = '';


    for (const animeItem of animes) {
      const animeElement = makeAnime(animeItem);
      if (!animeItem.isComplete) {
        uncompletedANIMEList.append(animeElement);
      } else {
        completedANIMEList.append(animeElement);
      }
    }
  });

  function addAnimeToCompleted(animeId) {
    const animeTarget = findAnime(animeId);

    if (animeTarget == null) return;

    animeTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findAnime(animeId) {
    for (const animeItem of animes) {
      if (animeItem.id === animeId) {
        return animeItem;
      }
    }
    return null;
  }

  function removeAnimeFromCompleted(animeId) {
    const animeTarget = findAnimeIndex(animeId);

    if (animeTarget === -1) return;

    animes.splice(animeTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoAnimeFromCompleted(animeId) {
    const animeTarget = findAnime(animeId);

    if (animeTarget == null) return;

    animeTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findAnimeIndex(animeId) {
    for (const index in animes) {
      if (animes[index].id === animeId) {
        return index;
      }
    }
    return -1;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(animes);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    } 
  }

  const SAVED_EVENT = 'saved-anime';
  const STORAGE_KEY = 'ANIME_APPS';

  function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung');
      return false;
    }
    return true;
  }

  document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
  })

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
      for (const book of data) {
        animes.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

