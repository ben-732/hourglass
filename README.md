# Show Control Systems

A collection of things to make my life (marginally) easier while prompting from FOH

All Components running on a local private network.

## Hourglass Halves

Led Strip
Pico
Small LED for network status

## Raspberry pi

Running express web server

### Hourglass Interface

- Running local mqtt broker
- Webserver receives requests from qlab
- Webserver sends mqtt messages to hourglass

### Comms Integration

- Comms input from sound board using usb sound card
- Streams to [mediaMTX](https://github.com/bluenviron/mediamtx) server

### Lighting integration

- OSC Messages from onyx for cue number
- Cue number referenced against list of cues

### Overview Page

- React page
- Served by express webserver
- Cues Section, lists times that cue was triggered
- Comms section, stream of comms audio from mediaMTX
  - Privlaged access
- Status icons for hourglass halves
