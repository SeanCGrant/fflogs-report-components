// A report componenet that shows when a marker or tether is assigned to a player.

getComponent = () => {

  // Get the start of the fight
  const startTime = reportGroup.fights[0].startTime

  // Get the marker offset (does it apply to tethers too?)
  const markerOffset = reportGroup.fights[0].headMarkerOffset

  // Select events
  data = reportGroup.fights[0].allEvents
    .filter(event => 
      (event.type === "tether" | event.type === "headmarker"))

  //return data[0]

  // Track the time of last event
  last_event_time = -1

  // Create Rows
  const rows = data.map(event => {
    // Check for repeated time
    const same_time = last_event_time === event.timestamp
    // Update time tracker
    last_event_time = event.timestamp
    // Format time
    const formatted_time = new Date(event.timestamp - startTime).toISOString().substr(14, 8)

    return {
      time: same_time
        ? `<Kill> <Up> </Kill>`
        : formatted_time,
      type: event.type === 'tether'
        ? `<Pet>Tether  <Icon type="swap"></Pet>`
        : `<Earth>Marker</Earth>`,
      name: event.type === 'tether'
        ? `${event.source.name}`
        : event.source.name,
      target: event.type === 'tether'
        ? `<Right>${event.target.name}`
        : ' ',
      id: event.type === 'tether'
        ? event.tetherId
        : event.markerId + markerOffset
    }
  })

  return {
    component: 'Table',
    props: {
      columns:
      {
        title: {
          header: "Markers",
          columns:
          {
            time: {
              header: "Time"
            },
            type: {
              header: "Type"
            },
            id: {
              header: "ID"
            },
            name: {
              header: "Player"
            },
            target: {
              header: "Link"
            }
          }
        }
      },
      data: rows
    }
  }
}
