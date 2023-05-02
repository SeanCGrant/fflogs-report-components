// A report component that shows when an enemy applies a debuff to a player, and what ability was used to do so.

getComponent = () => {

  const onlyOneFightSelected = reportGroup.fights.length === 1;
  if (!onlyOneFightSelected) {
    return {
      component: 'EnhancedMarkdown',
      props: {
        content: `This component only works for a single pull.`
      }
    }
  }

  // Fight start time
  startTime = reportGroup.fights[0].startTime

  // Track last event
  last_event_time = -1

  const rows = reportGroup.fights.flatMap(fight => {
    return fight.allEventsByCategoryAndDisposition("aurasGained", "friendly")
    .filter(event => {
      return event.type === "applydebuff"
          && event.sourceDisposition !== "friendly"
    })
    .map(event => debuffMarkdown(fight, event, last_event_time));
  });

  // return rows;

  return {
    component: 'Table',
    props: {
      columns: {
        title: {
          header: "Debuffs",
          columns:{
            timestamp: {
              header: 'Time'
            },
            target: {
              header: 'Player'
            },
            source: {
              header: 'Source'
            },
            ability: {
              header: 'Ability'
            },
            debuff: {
              header: 'Debuff'
            }
          }
        }
      },
      data: rows
    }
  }
}

function debuffMarkdown(fight, event, last_event) {
  const timestamp = last_event_time === event.timestamp
    ? `<Kill> <Up> </Kill>`
    : new Date(event.timestamp - startTime).toISOString().substr(14, 8);
  const target = `<ActorIcon type="${event.target.subType}">${event.target.name}</ActorIcon>`;
  const source = event.source.name
  const applied = `<AbilityIcon id={${event.appliedByAbility?.id}} icon="${event.appliedByAbility?.icon}">${event.appliedByAbility?.name}</AbilityIcon>`
  const ability = `<AbilityIcon id={${event.ability.id}} icon="${event.ability.icon}">${event.ability.name}</AbilityIcon>`;
  
  // update last event time
  last_event_time = event.timestamp

  return {
    timestamp: timestamp,
    target: target,
    source: source,
    ability: applied,
    debuff: ability,
    event: event
  }
}
