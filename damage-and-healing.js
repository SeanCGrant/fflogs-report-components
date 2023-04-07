// A Report Component that largely reproduces the "Resources" tab -- including damage and healing to a select player with current hp values.
// Can be used to customize Resource view.

getComponent = () => {

  // Make sure a player actor is selected
  if (!reportGroup.fights[0].friendlyParticipants
        .filter(actor => actor.type === "Player")
        .map(player => player.id)
        .includes(eventFilters.actorId)){
    return {
      component: "EnhancedMarkdown",
      props: {
        content: "Please select a player."
        }
    }
  }

  // Select healing and damage events for the selected player
  const data = reportGroup.fights[0]
    .events
    .filter(event => 
      event.target?.id === eventFilters.actorId
      & (event.type === "heal" | event.type === "damage")
      & event.isTick === false)
        .slice(0,100)

  // Get the start of the fight
  const startTime = reportGroup.fights[0].startTime

  // create rows
  const rows = data.map(event => {

    // Get mits/boosts
    const multipliers = event.multiplierStatusEffects
      ? event.multiplierStatusEffects
        .filter(multiplier => multiplier)
        .map(multiplier => multiplier.ability.name)
      : ' '

    // Check for overkill
    overkill = event.overkill? `(${event.overkill})` : ""
    // Check for overheal
    overheal = event.overheal
      ? event.overheal===0
        ? "" : `(${event.overheal})`
      : ""

    // Build Row
    return {
      time: new Date(event.timestamp - startTime).toISOString().substr(14, 8),
      source: event.source.type === "Player"
        ? `<ActorIcon type = "${event.source.subType}""><Styled type="${event.source.subType}"> 
          ${event.source.name} </Styled>`
        : event.source.type === "Pet"
          ? `<ActorIcon type = "${event.source.petOwner.subType}""><Styled type="${event.source.petOwner.subType}"> 
            ${event.source.petOwner.name} </Styled>`
          : `<ActorIcon type = "${event.source.subType}""><Styled type="Boss"> 
            ${event.source.name} </Styled>`,
      target: 
        `<Styled type="${event.target.subType}">
          ${event.target.name} </Styled>`,
      ability: `<AbilityIcon id="${event.ability.id}" icon="${event.ability.icon}"> 
        ${event.ability.name} </AbilityIcon>`,
      status: multipliers === ' '
        ? ' '
        : `${multipliers} (${event.multiplierTotalFromStatusEffects / 100})`,
      damage: event.type === 'damage'
        ? `<Wipe>${event.amount}</Wipe> ${overkill}`
        : ' ',
      heal: event.type === 'heal'
        ?`<Kill>${event.amount}</Kill> ${overheal}`
        : ' ',
      hp: event.targetResources.hitPoints === event.targetResources.maxHitPoints
        ? `<Kill>${event.targetResources.hitPoints}</Kill>`
        : event.targetResources.hitPoints === 0
          ?`<Wipe>${event.targetResources.hitPoints}</Wipe>`
          : event.targetResources.hitPoints
    }

    return null
  })

  return {
    component: 'Table',
    props: {
      columns: {
        time: {
          header: 'Time'
        },
        source: {
          header: 'Source'
        },
        ability: {
          header: 'Ability'
        },
        target: {
          header: 'Target'
        },
        status: {
          header: 'Effects'
        },
        damage: {
          header: 'Damage'
        },
        heal: {
          header: 'Healing'
        },
        hp: {
          header: 'Health'
        }
      },
      data: rows
    }
  }
  
}
