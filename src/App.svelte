<script>
  import {onMount} from 'svelte'
  import {createAssistant, createSmartappDebugger} from '@sberdevices/assistant-client'
  import {logger} from './logging'; // Use custom logger to clean up assistant-client`s spam
  import {setTheme} from './themes';

  let assistant;
  let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNjk4NTAzMzgzMjViZmViZjg2ZGVjYjAzZDkzZjkwZDQ2ZmMxNmNmZGZiNTUyMDAzNGQxOTFkMWEwYTQ4NDQyNTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyNDQ0NjI5MiwiaWF0IjoxNjI0MzU5ODgyLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiMTU1ZWEzYjktOTQyOC00NjJkLTkxZjEtOGYzZDk3NjBlODZhIiwic2lkIjoiY2MzYmJlYjktNjkxYS00MDhiLWI4OGQtZTE5OWRjZmZmZmZkIn0.t1thJRzlTSV3ADVOWQXQbETGmh5Vj2XZwPUyNC4fzgSbOYTPrZgHwRFgtBHnnQVC5aBOJRUiotfVCOsvfmG-fjbSAuPB5Mc_GjFJpJ1V2Y_yBhQ7_S6kz5eNooKELy53mPlV67fqta9hg32p4yoLYZUpMuO7gLKbcWOr5S7AZT6iOCgoRC5kALVdRbqHOjxSgLy_QtUCrK3hP_ehyG_S8o689_CdD7uz-_3HaD1IzAhuoBbyq3JAxinfqzfdmMPUWwCbCUf3HwYTaZJlVcbMOprm0ao0dZzkhdk3zgkqSVKpmqmB4y5iQie7UR8HrkAO-K5FZxcvuC4i5ulzAPcmaXYP845ZEzJaswbppkQHfBiDSy6zmAmTlMUzbb5tG1zINM0HdFMw0LmCRCRaFNChQpMYkL8rgLLahK87yh2vpHfdTtL8hXmNLh-QxyFcsuM7S6J23xNnSFnjWRenQ16KNKj10MSNwc1X551bXlTN_Tg-4foBrjnJOx-k-zXEK9DdIo8JEzVd5WxYUqrEztsztNGUUtQkMa91mstcbkP3dG9iOL0nuDuw0fgLfX1t0WFyZooCi3joRKsw5V3rIQce-f2rWVTtjpR7E9p8dY4-lIUOOiTC0H4778RRX7POmOdn7T8WmaxgE5jc9VIewMQ1jk6XQRBvSsHRt9dI2JIIxc8';       // Set token for assistant-client from https://developers.sber.ru/studio/settings/emulator
  let initPhrase = 'Запусти Угадай флаг';  // Set the name of your SmartApp for activation

  let character = 'eva';
  $: setTheme(character);

  let variants = [
    {name: 'Старана 1', used: false},
    {name: 'Старана 2', used: false},
    {name: 'Старана 3', used: false},
    {name: 'Старана 4', used: false},
  ];
  let country = {iso: 'bw'};
  let score = 0;

  onMount(() => {
    function getState() {
      return {variants, country, score};
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
      logger.log(event)
      if (event.type === 'smart_app_data' && event.smart_app_data) {
        if (event.smart_app_data.type === 'close_app') {
          logger.log('Closing app')
          assistant.close();
          return;
        }
        ({country, variants, score} = event.smart_app_data);
        logger.log(event.smart_app_data);
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
    <h2>Счет: {score}</h2>
    <img src="/flags/{country.iso}.svg" alt="{country.name} flag">
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

  img {
    min-width: 300px;
    width: 60%;
    margin: 20px;
  }

  .card {
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 30px 1px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    padding: 30px;
    width: 80vw;
    max-width: 1000px;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: -100px;
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
    margin: 10px;
    padding: 20px;
    background: var(--plasma-colors-buttonAccent);
    color: var(--plasma-colors-buttonPrimary);
    font-weight: 700;
    font-size: 25px;
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


  @media (max-width: 600px) {
    .card {
      width: 100%;
      margin: 0;
    }
    h2 {
      font-size: 30px;
    }
    img {
      min-width: 100px;
      width: 90%;
      padding: 10px;
      max-height: 300px;
    }
    .card {
      padding: 20px 0;
    }
    button {
      font-size: 17px;
      padding: 10px;
    }
  }
</style>