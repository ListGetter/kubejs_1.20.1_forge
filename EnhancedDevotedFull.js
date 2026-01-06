//Devoted from fathomless crimson, 1.20.1 forge Kubejs script
//enhancments: I did not make the actual mob I just gave the fight more things and less problems (because the mob is still work in progress in the mod)
//1 cannot die from fire, suffocation, drowning, projectiles, or falling because you can cheese it with those
//2 teleports you around while targetting your so that its cooler and so you cant cheese it by shoving it into a hole
//3 cool talking lines
//4 hopefully the cleanup is good in this script
// its mostly made for my modpack because your very powerful in it so i need to make sure you cant kill the boss in 20 seconds with a light machine gun.

//How to use: once everything is installed right click cyan dye ONCE. Only 1 guy can teleport you at a time because you get teleported based on the uuid of the last guy you summoned.
//How to install: download forge 1.20.1 (probably just use curseforge app its really ez), download kubejs 1.20.1, load into minecraft then leave, go into the minecraft folder > go to kubejs folder > go to server scripts folder > create a new .js folder and then paste this in there.
//my miencraft folder path looks liek C:\Users\Myname\curseforge\minecraft\Instances\LichQuest\kubejs\server_scripts
// you might have to look up how to create a .js file.

function randomline(list) {
  return list[Math.floor(Math.random() * list.length)]
}

PlayerEvents.loggedIn(event => {// this is the player login event that might be important.
  event.server.scheduleInTicks(10, function (){//some bug makes tick scheduling not work the first time so i jsut do it here.
    event.player.tell('sim')
  })
    event.player.persistentData.putInt("timesjoined", event.player.persistentData.getInt("timesjoined") + 1)

    if (event.player.persistentData.getInt("timesjoined") === 1){//first join
        event.player.persistentData.putString("AssignedAvengerUUID", "")
    }
    
})



const DevotedName = "Bastard" //havent figured out the bossbar yet
//Thanks gpt
const EntityType = Java.loadClass('net.minecraft.world.entity.EntityType');
const CompoundTag = Java.loadClass('net.minecraft.nbt.CompoundTag');

function spawnAvenger(level, x, y, z, entityName, target) {
    //get entity type
    let entityType = EntityType.byString(entityName).orElse(null);
    if (!entityType) {
        console.log("Invalid entity: " + entityName);
        return;
    }

    //create entity
    let entity = entityType.create(level);
    if (!entity) return;

    //set position
    entity.setPos(x, y, z);

    //create persistent nbt
    let tag = new CompoundTag();
    tag.putBoolean("avengerofmosk", true);
    tag.putString('targetname', target.name.getString());

    //merge with entity persistent data
    entity.getPersistentData().merge(tag);

    //spawn entity in level
    level.addFreshEntity(entity);
    target.persistentData.putString("AssignedAvengerUUID", entity.uuid)

}

ItemEvents.rightClicked('cyan_dye', event =>{ //gives you 10 seconds to prepare.
    event.player.tell({text: "um why do i feel like were about to be teleported? Get weapons.", color: "blue"})
    event.server.scheduleInTicks(200, function(){
        event.player.tell({text: "GET OVER HERE AND FACE RETRIBUTION!", color: "red"})
        event.server.scheduleInTicks(100, function(){
            event.server.runCommandSilent(`/execute at ${event.player.name.getString()} run spreadplayers ~ ~ 200 5 false ${event.player.name.getString()}`)
            event.player.tell({text: 'FACE ME!', color: "red"})
            spawnAvenger(event.server.getLevel("overworld"), event.player.x, 500, event.player.z, "fathomless:the_devoted", event.player);
        })
    })
})

EntityEvents.spawned('fathomless:the_devoted', event=>{
    if (!event.entity.persistentData.getBoolean('avengerofmosk')) return
    event.entity.customName = DevotedName
    let player = event.entity.persistentData.getString('targetname')

    event.server.runCommandSilent(`/execute at ${player} run spreadplayers ~ ~ 1 5 false ${event.entity.uuid}`)
})

PlayerEvents.tick(event=>{ //teleportation every 15 secds
    if (event.server.getTickCount() % 300 !== 0) return
    let AAUUID = event.player.persistentData.getString('AssignedAvengerUUID')
    if (AAUUID == null || AAUUID == "") return
    //event.player.tell(AAUUID)
    let Avengeruuid = event.player.persistentData.getString('AssignedAvengerUUID')
    let playername = event.player.name.getString()
    event.server.runCommandSilent(`/execute at ${playername} run spreadplayers ~ ~ 1 100 false ${playername}`)
    event.server.runCommandSilent(`/execute at ${playername} run spreadplayers ~ ~ 1 5 false ${Avengeruuid}`)
})

EntityEvents.spawned('player', event => {
    event.server.scheduleInTicks(1, function(){
        //event.entity.tell('hidddd')
        let AAUUID = event.entity.persistentData.getString(`AssignedAvengerUUID`)
        if (AAUUID !== ""){
        
        event.server.runCommandSilent(`/tp ${AAUUID} ~ -1000 ~`)
        event.entity.tell({text: "Justice is served...", color: "red"})
        
        event.entity.persistentData.putString(`AssignedAvengerUUID`, "")}
    })
    
})
EntityEvents.death('fathomless:the_devoted', event =>{
    if (!event.entity.persistentData.getBoolean('avengerofmosk')) return
    event.server.scheduleInTicks(3, function(){
        //event.server.tell('poopoooopopopopopopopopopopopopopop')
    for (let player of event.server.getPlayers()){
        let AAUUID = player.persistentData.getString('AssignedAvengerUUID')
        event.server.tell('checking: ' + player.name.getString() + " for " + AAUUID)
        if (AAUUID == "") continue

        let Avenger = event.server.getLevel('overworld').getEntity(AAUUID);
        //event.server.tell('Avenger uuid: ' + Avenger.uuid)
        //event.server.tell('Avenger val: ' + Avenger)
        //event.server.tell('Avenger removed: ' + Avenger.isRemoved())
        //event.server.tell('Avenger isalive: ' + Avenger.isAlive())
        if (!Avenger || !Avenger.isAlive() || Avenger.isRemoved()){
            player.persistentData.putString('AssignedAvengerUUID', "")
            //event.server.tell('cleaned dead uuid')
        }
    }
    })
     
})


const DevotedIndirectLines = ["Your going to have to fight me face to face", "that almost tickled", "Get over here", "I am no goliath, and you are no david", "My armor destroys damage from cowards", "hahhaah", "FACE ME", "Your technology fails you criminal", ""]
const DevotedDirectLines = ["Thats more like it!", "GET OVER HERE", "I WILL MAKE YOU SUFFER FOR WHAT YOU DID TO MY FATHER!", "MY BROTHER!", "MY HOME!", "DIE", "RAH", "you will pay", "DODGE THIS"]
EntityEvents.hurt('fathomless:the_devoted', event => {
    if (!event.entity.persistentData.getBoolean('avengerofmosk')) return
    let dmgid = event.source.type().msgId()
    if (["drown", "inWall", "lava", "onFire", "fall"].indexOf(dmgid) !== -1){
        event.cancel()
    }
    //event.server.tell(event.source.type().msgId())
    let player = event.source.actual
    if (!player || !player.isPlayer()) return

    let sayaline = false
    if (Math.random() > 0.90) sayaline = true//change the 0.90 to make it more likely to say something when hit.

    if (event.source.isIndirect()){//for projectiles and stuff
    if (sayaline){
        player.tell({text: DevotedName+": " + randomline(DevotedIndirectLines), color: "red"})
    }
    event.cancel()
    }

        else if (sayaline){
            player.tell({text: DevotedName+": " + randomline(DevotedDirectLines), color: "red"})
    }
})