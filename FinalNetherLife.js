//the event
const PlayerChangeGameModeEvent = Java.loadClass('net.minecraftforge.event.entity.player.PlayerEvent$PlayerChangeGameModeEvent')

//event handler
NativeEvents.onEvent(PlayerChangeGameModeEvent, event => {
    let player = event.getEntity()
    if (event.getNewGameMode() != "SPECTATOR") return
    let server = player.getServer()
    let lives = player.nbt.getCompound("ForgeCaps").getCompound("semihardcore:semihardcore").getInt("lives")
    if (lives != 0) return

    server.scheduleInTicks(1, function(){ //rest in here for some reason works


    if (player.persistentData.getBoolean('NetherHardcore')) return
    let puuid = player.uuid
    let pname = player.name.getString()
//a ftbquest being completed on death, to help the player off the nether roof and the rewards are blocked so they cant get their rewards untill they escape.
    //server.runCommandSilent(`/ftbquests change_progress ${pname} complete 6D9C1B23961BE736`)
    //server.runCommandSilent(`/ftbquests block_rewards true ${pname}`)

    server.scheduleInTicks(40, function(){
        player.tell('well shit.')
    })

    server.scheduleInTicks(100, function(){
        player.tell('WAIT WHAT! RESIST IT!')
//simulates being dragged to hell
        for (let i = 0; i<100; i++){ 
        server.scheduleInTicks(i, function(){
            server.runCommandSilent(`/execute at ${puuid} run tp ${puuid} ~ ~-1 ~`)
        })
        }
    })
//far coords and spreadplayers to put them on roof in safe area.
    server.scheduleInTicks(200, function(){
        server.runCommandSilent(`/execute in minecraft:the_nether run tp ${player.uuid} 67669 1000 0`)
    })
    server.scheduleInTicks(230, function(){
        server.runCommandSilent(`/execute in minecraft:the_nether run spreadplayers ${player.x} ${player.z} 100 1 false ${player.uuid}`)
    })
//sets them to survival 3 ticks later and marks the process as complete with persistent data.
    server.scheduleInTicks(233,  function(){
        player.setGameMode('survival')
        player.persistentData.putBoolean('NetherHardcore', true)
    })


    })

    
    
})
