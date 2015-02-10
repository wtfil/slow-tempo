var React = require('react');
var Reflux = require('reflux');
var store= require('../lib/song-store');
var actions = require('../lib/audio-actions');
var UpdatableInput = require('../components/updatable-input');

var Riff = React.createClass({
	displayName: 'Riff',
	updateName(name) {
		actions.updateRiff({
			index: this.props.index,
			songId: this.props.songId,
			name: name
		});
	},
	updateFormula(formula) {
		actions.updateRiff({
			index: this.props.index,
			songId: this.props.songId,
			formula: formula
		});
	},
	render() {
		return <div className="riff">
			<UpdatableInput className="riff__formula" onChange={this.updateFormula} value={this.props.riff.formula}/>
			<div className="riff__name">
				<UpdatableInput onChange={this.updateName} value={this.props.riff.name}/>
			</div>
		</div>;
	}
});

var Song = React.createClass({
	getInitialState() {
		return {
			editable: false,
			name: this.props.song.name
		};
	},
	render() {
		var className = 'song-item';
		if (this.state.editable) {
			className += ' editable';
		}
		return <div className={className}>
			{this.state.editable ?
				<div className="song-item__options">
					<UpdatableInput className="song-item__input" value={this.state.name} onChange={this.updateName}/>
					<div className="song-item__riffs">
						<div>
							<span>riffs</span>
							<i className="song-item__add" onClick={this.addRiff}>+</i>
						</div>
						{this.props.song.riffs.map((riff, index) => <Riff riff={riff} key={index} index={index} songId={this.props.song.id}/>)}
					</div>
				</div> : <div>
					<span className="song-item__delete" onClick={this.deleteItem}>+</span>
					<span className="song-item__edit" onClick={this.setEditable}>edit</span>
					<span className="song-item__name" onClick={this.onClick}>{this.state.name}</span>
				</div>
			}
		</div>;
	},

	addRiff() {
		actions.addRiff(this.props.song.id);
	},
	deleteItem() {
		actions.deleteSong(this.props.song.id);
	},
	updateName(name) {
		actions.changeName({
			id: this.props.song.id,
			name: name
		});
		this.setState({
			editable: false,
			name: name
		});
	},
	setEditable(e) {
		e.stopPropagation();
		this.setState({editable: true});
	},
	onClick() {
		actions.changeSong(this.props.song);
	}
});

module.exports = React.createClass({
	displayName: 'SongsList',
	mixins: [Reflux.listenTo(store, 'forceUpdate')],
	render() {
		return <div className="songs-list">
			<div className="songs-list__head">
				<label className="file-input">
					<input type="file" onChange={this.onChange}/>
					<div>+ upload file</div>
				</label>
			</div>
			<div className="songs-list__list">
				{store.songs.map((song, key) => <Song key={song.id} song={song}/>)}
			</div>
		</div>;
	},
	onChange(e) {
		actions.setFile(e.target.files[0]);
	}
});
