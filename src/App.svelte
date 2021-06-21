<script>
  import {onMount} from 'svelte'
  import {createSmartappDebugger, createAssistant} from '@sberdevices/assistant-client'
  import {logger} from './logging'; // Use custom logger to clean up assistant-client`s spam
  import {setTheme} from './themes';

  let assistant;
  let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNjk4NTAzMzgzMjViZmViZjg2ZGVjYjAzZDkzZjkwZDQ2ZmMxNmNmZGZiNTUyMDAzNGQxOTFkMWEwYTQ4NDQyNTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyNDMwNzkxMiwiaWF0IjoxNjI0MjIxNTAyLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiZmU5NjdhY2MtNGIyZi00MzBkLTljOGItMmU4OGVmNjZkYmRmIiwic2lkIjoiN2JjN2I0NmItODM0Yi00MTRjLThmZWYtN2JkYzY4NWNhZDczIn0.plPVFE855wLn0mwQQTX1BPuC-fdY8DKPlnN0enFrRFM7wkVQCevD6MsZsPU1nuP3jNe77lzd46NmFDwqKJ8FvBimlB27MsGySNrwyFTEZyDkE8y201nQGtPS7GHHAHEgXlvc5wARl65Gjl7sMVo1QCXfTOyJevPbRHQHwEITVVmhrpprAUMi8cwhyc7Ogrc4mriMDsbfAtlQl0JnyFzJls5nkl4qS4D5H2Rd-sfLxG1DbGSbYKm2Rslrk9IyUK2NZq-qFjxSD29egQ7TXibcJfuYJyOnXyOc_J3D2GZ835gjhw86D6Rf4JhLjyzNBK5ml7qrC_3moVivLFeCGU6zxOiLa68gbHabrnnCKjKSWu2mepblbh42pIsu7dWRJH3qTuFVkIbzH3Z8ASbFEeRkvrUpf1RgYI-9r50E6kZhR-Y4zdySV-N2vzD5IwOz9Z1JwyFvedoMTRTVL-pTwM7ZFPMq9j7DtvgHg2nsGIHtMu_7_uOxvAw4OHwEWIZGlD5ElyZTghWR_-BYxJe2Xae0TUeHSCklHX3rLAQ1cG5r-OBCAhp24ZqIF__tCA_eh3GQTiHMzoYXq2sWud8X7fmXF-R2ytTuWJIERgBcwbPdi4OA57oBhQEi4NWJKLfRJHZmg-HXIFGKGIo2jiWPksi85Rr7FzuMG6mxzuR-cLgM8ag';       // Set token for assistant-client from https://developers.sber.ru/studio/settings/emulator
  let initPhrase = 'Запусти Угадай флаг';  // Set the name of your SmartApp for activation

  let character = 'eva';
  $: setTheme(character);

  let variants = [
    {name: 'Старана 1', used: false},
    {name: 'Старана 2', used: false},
    {name: 'Старана 3', used: false},
    {name: 'Старана 4', used: false},
  ];
  let country = {emoji: '🇧🇼'};
  let score = 0;

  onMount(() => {
    function getState() {
      console.log('State was get');
      return {};
    }

    const init = () => {
      // Use it for debugging in browser
      // return createSmartappDebugger({
      //   token,
      //   initPhrase,
      //   getState,
      //   settings: {debugging: false}
      // })
      return createAssistant({getState});
      // TODO: Use to run it in production mode inside Salute App
    }
    assistant = init();

    assistant.on('start', () => {
      logger.log('SmartApp started',);
    });

    assistant.on('data', (event) => {  // Set your action or data hooks
      // fetch('/log', {
      //   method: "POST",
      //   body: JSON.stringify(event),
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      // });
      if (!event.type) {  // Use invariants to prevent errors on Sber Portal
        return;
      }
      if (event.type === 'character') {
        character = event.character.id;
      }
      if (event.type === 'smart_app_data' && event.smart_app_data) {
        if (event.smart_app_data.type === 'close_app') {
          logger.log('Closing app')
          assistant.close();
          return;
        }
        ({country, variants, score} = event.smart_app_data);
      }
    });
  })

  function click(i) {
    if (variants[i].name !== country.name) {
      variants[i].used = true;
    }
    assistant.sendData({action: {action_id: 'click', data: variants[i].name}})
  }
</script>

<main>
  <div class="card">
    <h2>Ваш счет: {score}</h2>
    <h1>{country.emoji}</h1>
    <div class="buttons">
      {#each variants as {name, used}, i}
        <button class:used on:click={() => {click(i)}}>{name}</button>
      {/each}
    </div>
  </div>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    background-color: var(--plasma-colors-background);
    background-image: var(--plasma-colors-gradient);
    color: var(--plasma-colors-text);
  }

  .card {
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 30px 1px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    padding: 30px;
  }

  .used {
    background-color: var(--plasma-colors-buttonCritical);
  }

  .used:hover, .used:focus {
    background: var(--plasma-colors-buttonCritical);
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  button {
    font-size: 14px;
    margin: 10px;
    padding: 10px;
    background: var(--plasma-colors-buttonAccent);
    color: var(--plasma-colors-buttonPrimary);
    font-weight: 500;
    transition: background ease 0.5s;
    border: 1px solid transparent;
    border-radius: 5px;
    user-select: none;
  }

  button:hover, button:focus {
    background: var(--plasma-colors-buttonFocused);
    /*background: black;*/
  }

  h2 {
    text-align: center;
    margin: 0;
    font-size: 50px;
  }

  h1 {
    color: #14c07c;
    text-align: center;
    margin: 0;
    font-size: 200px;
    text-transform: uppercase;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>