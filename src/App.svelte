<script>
  import {onMount} from 'svelte'
  import {createAssistant} from '@sberdevices/assistant-client'
  import {logger} from './logging'; // Use custom logger to clean up assistant-client`s spam
  import {setTheme} from './themes';

  let assistant;
  let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNjk4NTAzMzgzMjViZmViZjg2ZGVjYjAzZDkzZjkwZDQ2ZmMxNmNmZGZiNTUyMDAzNGQxOTFkMWEwYTQ4NDQyNTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyNDc0MzA0MCwiaWF0IjoxNjI0NjU2NjMwLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiNDhmYWU0YmUtNWNkYy00MWY3LWE4YzItNDhmMmU5ZDgwMWM1Iiwic2lkIjoiNTdlNzlhN2MtNWMyYS00MTM2LTg0NWMtMzM3NjU0MjRjYzU2In0.dp4Zo6xFmUv54W4YFprQeTZ-o5M535PGkpox2KXy8CXOyqe4cBXAPtwgch4Ia0dtsYJx48DcggvLSffhogMOU7C_R5dOQTHUalC-lYHlDbb7LBRsoZdYO2cr4CIsscHRnrdHmMkAEBhhfZx8l3OV-ReOTZZfNWbWYSBX3Mup0-yY5FTf-txwkeZcEWMrkpgdNEGkTD5VCs2I3_boM3u6H5gSRKj1-UT2TnVz1oc66MedjwLb2ZVfMx2xurASZ7teW3J2hQgkBJO5J6nJ0-CSm7MRbNpk8JFF1DOgjmhbopxM8gqTZC26QTWC50pf8A8pvvosurUvAcizLpqCE2oUxrWtldsAG7URsMfqm1vazIM0nN-C6XFICokNrGWF5QEHDXEbuanu9Dca1P3UVjN80S2WtQlJa1CLTGDGdO5Y5rCswHdKP4f8pl3sZagekhljG5ynnonh__CYemohfqZUdVL9T6Ox06O1kAw9JMMSUPe4jaMxPqOqHhCTPoyRLxEykydJscZ6lAszn01JXCqk2qztVv_vxC8ME16ECfiO64La1AofdDZy9TKZUDDdLhXNMpPsK22AgIcRVNs6bSkyjllPOp3MTjh5ucaQS1HaSW-HuNcyUwRPMB2bcfzk394qYZDWGKXhx5apDTkjx02IY9vn9aisUWySKzbMRHDVUN8';       // Set token for assistant-client from https://developers.sber.ru/studio/settings/emulator
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
  let main;
  let buttons = [];
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
        main.focus();
        for (const i of Array(4).keys()) {
          document.getElementById(`button-${i}`).blur();
        }
      }
    });
  })

  function click(i) {
    if (variants[i].name !== country.name) {
      variants[i].used = true;
    }
    assistant.sendData({action: {action_id: 'click', data: variants[i].name}})
  }

  logger.log(buttons)
</script>

<main bind:this={main}>
  <div class="card">
    <h2>Счет: {score}</h2>
    {#key country.name}
      <img src="/flags/{country.iso}.svg" alt="{country.name} flag">
      <div class="buttons">
        {#each variants as {name, used}, i}
          <button id='button-{i}' class:used on:click={() => {click(i)}}>{name}</button>
        {/each}
      </div>
    {/key}
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
    width: 50%;
    margin: 20px;
  }

  .card {
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 30px 1px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    padding: 30px 10px;
    width: 80vw;
    max-width: 1000px;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: -5%;
  }

  .used {
    background-color: var(--plasma-colors-buttonCritical);
  }

  .used:hover, .used:focus {
    background: var(--plasma-colors-buttonCritical);
    border: 1px solid var(--plasma-colors-buttonWarning)
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 90%;
    min-width: 160px;
  }

  button {
    margin: 2%;
    padding: calc(7px + (15 - 7) * ((100vw - 200px) / (1440 - 200)));
    background: var(--plasma-colors-buttonAccent);
    color: var(--plasma-colors-buttonPrimary);
    font-weight: 700;
    /*font-size: 25px;*/
    font-size: calc(12px + (18 - 12) * ((100vw - 200px) / (1440 - 200)));
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
    font-size: calc(20px + (26 - 20) * ((100vw - 200px) / (1440 - 200)));

  }


</style>