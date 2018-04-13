import React, { Component } from 'react';
import {
    Image,
    StatusBar,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Text,
    Slider,
    View,
    Animated,
    ActivityIndicator,
    ProgressBarAndroid,
    Platform,
} from 'react-native';
import RCTIJKPlayer from './index';
var { height, width } = Dimensions.get('window');
var left = 0, top = 0;
// height = height/2;
// width = width/2;
console.log("width, height", width, height);
import Icon from 'react-native-vector-icons/FontAwesome';
const iconSize = 60;

const styles = StyleSheet.create({
    container: {
        top: 100,
        left: 100,
    },
    controllerView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    player: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,1)',
    },
    mediaBtnView: {
        // position: 'absolute',
        flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controller: {
        // flex: 1,
        // opacity: this.state.fadeAnim,
    },
    sliderView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
    },
    btn: {
        backgroundColor: 'transparent',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: Math.round(height / 2 - iconSize / 2),
        left: Math.round(width / 2 - iconSize / 2),
    },
    progressView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slider: {
    },
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    }
});


export default class RCTIJKPlayerWithController extends Component {
    state = {
        videoWidth: 0,
        videoHeight: 0,
        rotation: 0,
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        animating: true,
    };

    constructor(props) {
        super(props);
        this.rctijkplayer = null;
        this.state.height = this.props.height || height;
        this.state.width = this.props.width || width;
        this.state.left = this.props.left || 0;
        this.state.top = this.props.top || 0;
        Object.assign(this.state, {
            playBackInfo: {
            },
            fadeAnim: new Animated.Value(1),
            hasController: false,
        });
        this.progressIcon = this.renderProgressView();
    }

    componentDidMount() {
        let url = "http://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/gear1/prog_index.m3u8";
        // let url = "/Users/cong/Downloads/111.mov";
        // this.rctijkplayer.start({url: url});
        this.playbackInfoUpdater = setInterval(this.rctijkplayer.playbackInfo.bind(this.rctijkplayer), 1000);
        // this.setState({hasController: true,});
    }
    componentWillUnmount() {
        clearInterval(this.playbackInfoUpdater);
    }

    fadeIn() {
        // this.setState({hasController: true, fadeAnim: new Animated.Value(1)});
        // this.showing = true;

        Animated.timing(
            this.state.fadeAnim,
            { toValue: 1 }
        ).start(() => {
            this.setState({ hasController: true, });
            this.showing = true;
        });
    }

    fadeOut() {
        this.setState({ hasController: false, fadeAnim: new Animated.Value(0) });
        this.showing = false;
        // Animated.timing(
        //     this.state.fadeAnim,
        //     {toValue: 0}
        // ).start(() => {
        //     this.setState({hasController: false,});
        // });
    }

    hideController() {
        if (this.hideTimout) {
            clearTimeout(this.hideTimout);
        }
        this.hideTimout = setTimeout(this.fadeOut.bind(this), 3000);
    }

    resumePause() {
        if (this.state.playBackInfo.playbackState == RCTIJKPlayer.PlayBackState.IJKMPMoviePlaybackStatePlaying) {
            this.rctijkplayer.pause();
            if (this.props.onResumePause) {
                this.props.onResumePause({ playbackState: RCTIJKPlayer.PlayBackState.IJKMPMoviePlaybackStatePaused });
            }
            this.setState({ playBackInfo: Object.assign({}, this.state.playBackInfo, { playbackState: RCTIJKPlayer.PlayBackState.IJKMPMoviePlaybackStatePaused }) });
        } else {
            this.rctijkplayer.resume();
            if (this.props.onResumePause) {
                this.props.onResumePause({ playbackState: RCTIJKPlayer.PlayBackState.IJKMPMoviePlaybackStatePlaying });
            }
            this.setState({ playBackInfo: Object.assign({}, this.state.playBackInfo, { playbackState: RCTIJKPlayer.PlayBackState.IJKMPMoviePlaybackStatePlaying }) });
        }
        this.hideController();
    }

    start(options) {
        let { width, height, rotation } = options;
        this.setState({
            videoWidth: width,
            videoHeight: height,
            rotation: rotation,
        });
        this.rctijkplayer.start(options);
    }

    renderProgressView() {
        var progress_view;
        if (Platform.OS == 'ios') {
            progress_view = (<ActivityIndicator
                animating={this.state.animating}
                style={[styles.centering, { height: 80 }]}
                size="large"
                color="#ffffff"
            />)
        } else {
            progress_view = (<ProgressBarAndroid
                style={[]}
                styleAttr="Small"
            />)
        }
        return progress_view
    }

    getMediaBtn() {
        let top = Math.round(this.state.height / 2 - iconSize / 2);
        let left = Math.round(this.state.width / 2 - iconSize / 2);

        let playIcon = (<Icon name="play-circle" size={iconSize} color="#1E5C98" style={[styles.btn, { top: top, left: left }]} onPress={this.resumePause.bind(this)} />)
        let pauseIcon = (<Icon name="pause-circle" size={iconSize} color="#1E5C98" style={[styles.btn, { top: top, left: left }]} onPress={this.resumePause.bind(this)} />)

        switch (this.state.playBackInfo.playbackState) {
            case RCTIJKPlayer.PlayBackState.IJKMPMoviePlaybackStateStopped:
                return playIcon;
                break;
            case RCTIJKPlayer.PlayBackState.IJKMPMoviePlaybackStatePlaying:
                return pauseIcon;
                break;
            case RCTIJKPlayer.PlayBackState.IJKMPMoviePlaybackStatePaused:
                return playIcon;
                break;
            default:
                break;
        }
    }

    getController() {
        if (!this.state.hasController) {
            return;
        }
        return (<Animated.View
            style={{ flex: 1, opacity: this.state.fadeAnim }}
        >
            <View style={styles.mediaBtnView}>
            </View>
            {this.getMediaBtn()}
            <View style={styles.sliderView}>
                <Slider
                    style={styles.slider}
                    // maximumTrackTintColor="purple"
                    // minimumTrackTintColor="red"
                    maximumValue={this.state.playBackInfo.duration || 0}
                    value={this.state.playBackInfo.currentPlaybackTime || 0}
                    onValueChange={(value) => { this.onValueChange(value) }}
                    onSlidingComplete={(value) => { this.onSlidingComplete(value) }}
                />
            </View>
        </Animated.View>
        )
    }

    onPlayBackInfo(e) {
        if (this.sliderDragging) {
            return;
        }
        
        if (e.playbackState == RCTIJKPlayer.PlayBackState.IJKMPMoviePlaybackStatePlaying) {
            this.setState({ animating: false })
        } else if (e.playbackState == RCTIJKPlayer.PlayBackState.IJKMPMoviePlaybackStateInterrupted) {
            this.rctijkplayer.resume();
        }
        this.setState({ playBackInfo: e });
        this.props.onPlayBackInfo(e)
    }

    onValueChange(value) {
        this.sliderDragging = true;
        this.hideController();
    }

    onSlidingComplete(value) {
        this.sliderDragging = false;
        this.rctijkplayer.seekTo(value);
        this.hideController();
    }

    showController() {
        this.fadeIn();
        this.hideController();
    }

    showHideController() {
        if (this.showing) {
            this.showing = false;
            this.fadeOut();
        } else {
            this.showing = true;
            this.showController();
        }
        console.log("this.showing", this.showing);
    }


    render() {
        let playerStyle;
        if (Platform.OS == 'ios' && this.state.rotation && this.state.videoWidth && this.state.videoHeight) {
            playerStyle = {};
            playerStyle.transform = [{
                rotateZ: `${this.state.rotation}deg`,
            }];
            let videoWidth = this.state.videoWidth;
            let videoHeight = this.state.videoHeight;
            let videoRatio = videoWidth / videoHeight;
            let viewRatio = this.state.width / this.state.height;
            let logicWidth, logicHeight;
            if (videoRatio == viewRatio) {
                logicWidth = this.state.width;
                logicHeight = this.state.height;
            } else if (videoRatio < viewRatio) {
                logicHeight = this.state.height;
                logicWidth = videoRatio * logicHeight;
            } else {
                logicWidth = this.state.width;
                logicHeight = logicWidth / videoRatio;
            }
            if (this.state.rotation == 180) {
                playerStyle.width = logicWidth;
                playerStyle.height = logicHeight;
            } else {
                playerStyle.width = logicHeight;
                playerStyle.height = logicWidth;
            }
        } else {
            playerStyle = styles.player;
        }
        return (<View
            style={[styles.container, { left: this.state.left, top: this.state.top, width: this.state.width, height: this.state.height, justifyContent: 'center', alignItems: 'center' }]}
        >
            <RCTIJKPlayer
                ref={(rctijkplayer) => {
                    this.rctijkplayer = rctijkplayer;
                }}
                onPlayBackInfo={(e) => this.onPlayBackInfo(e)}
                style={[playerStyle]}
            >
            </RCTIJKPlayer>
            {this.renderProgressView()}
            {/* <TouchableOpacity
                onPress={this.showHideController.bind(this)}
                style={[styles.controllerView]}
            >
                {this.getController()}
            </TouchableOpacity> */}
        </View>
        );
    }
}