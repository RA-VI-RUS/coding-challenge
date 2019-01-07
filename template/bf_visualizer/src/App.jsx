import { Component } from 'react';
import ScriptViewer from './components/ScriptViewer';
import ProgramCounterDisplay from './components/ProgramCounterDisplay';
import DataViewer from './components/DataViewer';
import ScriptForm from './components/ScriptForm';
import InputArea from './components/InputArea';
import OutputArea from './components/OutputArea';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      done: false,
      hPtr: null,
      input: '',
      output: '',
      script: [],
      history: [],
    };
    this.handleFirst = this.handleFirst.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleLast = this.handleLast.bind(this);
    this.submitScript = this.submitScript.bind(this);
    this.getNext = this.getNext.bind(this);
    this.getBack = this.getBack.bind(this);
    this.fetchNext = this.fetchNext.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.apiUrl = 'https://sec.meetkaruna.com/api/v1/brainfuck';
  }

  getIPtr = () => (this.state.hPtr === null
    ? 0
    : this.state.history[this.state.hPtr].iPtr);

  getDPtr = () => (this.state.hPtr === null
    ? 0
    : this.state.history[this.state.hPtr].dPtr);

  getData = () => (this.state.hPtr === null
    ? []
    : this.state.history[this.state.hPtr].data);

  getNext(id) {
    if (!this.state.history) { return; }

    const nextPtr = this.state.hPtr + 1;
    if (this.state.history[nextPtr]) {
      this.setState({ hPtr: nextPtr });
      return;
    }

    if (this.state.done) { return; }
    this.fetchNext(id);
  }

  getBack() {
    this.setState(state => ({
      hPtr: Math.max(0, state.hPtr - 1),
    }));
  }

  fetchNext(id) {
    fetch(`${this.apiUrl}/${id}/step`, {
      method: 'POST',
      body: JSON.stringify({ step: 1, input: this.state.input }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => this.setState(state => ({
        id: json.id,
        done: json.done,
        hPtr: state.hPtr + 1,
        script: json.script,
        output: json.output,
        history: [...state.history, {
          iPtr: json.instruction_pointer,
          dPtr: json.data_pointer,
          data: json.data,
        }],
      })));
  }

  submitScript(script) {
    fetch(this.apiUrl, {
      method: 'POST',
      body: JSON.stringify({ script, input: this.state.input }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => this.setState({
        id: json.id,
        done: json.done,
        hPtr: 0,
        script: json.script,
        output: json.output,
        history: [{
          iPtr: json.instruction_pointer,
          dPtr: json.data_pointer,
          data: json.data,
        }],
      }));
  }

  handleFirst() { this.setState({ hPtr: 0 }); }

  handleBack() { this.getBack(this.state.id); }

  handleNext() { this.getNext(this.state.id); }

  handleLast() { this.setState(state => ({ hPtr: state.history.length - 1 })); }

  handleInputChange(e) {
    this.setState({ input: e.target.value });
  }

  iPtrString = () => {
    if (this.state.hPtr === null) {
      return '0';
    }

    if (this.state.hPtr === this.state.history.length - 1 && this.state.done) {
      return ('Done!');
    }

    return this.state.history[this.state.hPtr].iPtr.toString();
  }

  render() {
    return (
      <div className="app">
        <ScriptForm
          submitScript={this.submitScript}
        />
        <ScriptViewer
          script={this.state.script}
          iPtr={this.getIPtr()}
        />
        <ProgramCounterDisplay
          iPtrString={this.iPtrString()}
          handleFirst={this.handleFirst}
          handleBack={this.handleBack}
          handleNext={this.handleNext}
          handleLast={this.handleLast}
        />
        <DataViewer
          dPtr={this.getDPtr()}
          data={this.getData()}
        />
        <InputArea
          handleInputChange={this.handleInputChange}
          inputValue={this.state.input}
        />
        <OutputArea
          output={this.state.output}
        />
      </div>
    );
  }
}
