'use strict';
const Cards = require('../Cards'),
	sock = require('../sock'),
	store = require('../store'),
	etgutil = require('../etgutil'),
	userutil = require('../userutil'),
	Components = require('../Components'),
	React = require('react');

module.exports = class Library extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			code: 0,
			showbound: false,
			pool: '',
			bound: '',
		};
	}

	componentDidMount() {
		sock.emit('librarywant', { f: this.props.name });
		store.store.dispatch(store.setCmds({
			librarygive: data => this.setState(data),
		}));
	}

	render() {
		const cardpool = etgutil.deck2pool(this.state.pool),
			boundpool = etgutil.deck2pool(this.state.bound),
			codeprog = code => {
				const upcode = etgutil.asUpped(code, true);
				return Math.min(
					(cardpool[code] || 0) +
						(boundpool[code] || 0) +
						((cardpool[upcode] || 0) + (boundpool[upcode] || 0)) * 6,
					42,
				);
			};
		let progressmax = 0,
			progress = 0,
			shinyprogress = 0,
			reprog = [],
			reprogmax = [];
		Cards.Codes.forEach((card, code) => {
			if (
				!card.upped &&
				!card.shiny &&
				card.type &&
				!card.getStatus('token')
			) {
				progressmax += 42;
				const prog = codeprog(code);
				const idx = card.rarity*13+card.element;
				reprog[idx] = (reprog[idx] || 0) + prog;
				reprogmax[idx] = (reprogmax[idx] || 0) + 42;
				progress += prog;
				shinyprogress += codeprog(etgutil.asShiny(code, true));
			}
		});
		const children = [];
		for (let e=0; e<13; e++) {
			children.push(
				<span className={`ico e${e}`} style={{
					position: 'absolute',
					left: `${36+e*53}px`,
					top: '54px',
				}} />
			);
		}
		for (let r=1; r<5; r++) {
			children.push(
				<span className={`ico r${r}`} style={{
					position: 'absolute',
					left: '8px',
					top: `${64+r*32}px`,
				}} />
			);
			for (let e=0; e<13; e++) {
				const idx = r*13+e;
				children.push(
					<span style={{
						position: 'absolute',
						left: `${36+e*53}px`,
						top: `${64+r*32}px`,
						fontSize: '12px',
					}}>{reprog[idx] || 0} / {reprogmax[idx] || 0}</span>
				);
			}
		}
		return <>
			<span style={{
				position: 'absolute',
				left: '100px',
				top: '8px',
			}}>
				Wealth {this.state.gold + Math.round(userutil.calcWealth(cardpool))}
			</span>
			<span style={{
				position: 'absolute',
				left: '320px',
				top: '8px',
				whiteSpace: 'pre',
			}}>
				ZE Progress {progress} / {progressmax}
				{'\nSZE Progress '}{shinyprogress} / {progressmax}
			</span>
			<span style={{
				position: 'absolute',
				left: '540px',
				top: '8px',
				whiteSpace: 'pre',
			}}>
				PvE {this.state.aiwins} - {this.state.ailosses}
				{'\nPvP '}{this.state.pvpwins} - {this.state.pvplosses}
			</span>
			<Components.Card x={734} y={8} code={this.state.code} />
			<input type='button'
				value='Toggle Bound'
				style={{
					position: 'absolute',
					left: '5px',
					top: '554px',
				}}
				onClick={() => {
					this.setState({ showbound: !this.state.showbound });
				}}
			/>
			<Components.ExitBtn x={8} y={8} />
			<Components.CardSelector
				cardpool={this.state.showbound ? boundpool : cardpool}
				filterboth
				onMouseOver={code => {
					code != this.state.code && this.setState({ code });
				}}
			/>
			{children}
		</>;
	}
};