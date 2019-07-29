// src/components/page/RealtimeMessageTable.js

import React from 'react'
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group'

import { grey } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import UUIDv1 from 'uuid/v1';

const TABLE_TOOLBAR_HEIGHT = 56;

const styles = theme => ({
    root: {
        height: '100%',
        padding: theme.spacing.unit * 2,
    },
    toolbar: {
        height: TABLE_TOOLBAR_HEIGHT,
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
    },
    tablePaper:{
        height: 'calc(100% - ' + (TABLE_TOOLBAR_HEIGHT * 1 + theme.spacing.unit * 2) + 'px)',
        // overflow: 'auto',
        overflow: 'hidden',
    },
    messageContainer: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing.unit,
    },
    avatar: {
        flex: '0 0 auto',
        marginRight: theme.spacing.unit * 2,
        width: '60px',
        height: '60px',
    },
    messageBody: {
        flex: '1 1 auto',
    },
    name: {
        display: 'block',
        fontWeight: 600,
    },
    message: {
        display: 'block',
        marginTop: theme.spacing.unit,
        padding: theme.spacing.unit * 2,
        background: grey[200],
        borderRadius: theme.spacing.unit * 2,
    },
});

class RealtimeMessageTable extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            tableId: UUIDv1(),
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log(this.props, nextProps)

        // if (nextProps.data === this.props.data[0]) {
            this.scrollToBottom(nextProps.data.length - 2);
        // }
    }

    // readPostsCallback  = (statusCode, response) => {
    //     switch (statusCode) {
    //     case StatusCode.OK:
    //         console.log(response)
    //         this.setState({
    //             data: response,
    //         });
    //         break
    //     default:
    //         alert(response.msg);
    //         break
    //     }
    // }

    scrollToBottom = (lastIndex) => {
        // let lastIndex = this.props.data.length - 1;
        if (lastIndex >= 0) {
            let rowId = this.generateTableRowId(lastIndex);
            let targetElement = document.getElementById(rowId);
            // console.log(rowId, targetElement);
            if (targetElement !== null) {
                var topPos = targetElement.offsetTop;
                var containerElement = document.getElementById(this.state.tableId);
                // console.log(topPos);

                var anim = setInterval(() => {
                    containerElement.scrollTop += 1;
                    if (Math.abs(containerElement.scrollTop - topPos) < 0.1) {
                        clearInterval(anim);

                        this.props.onAnimationEnd(this.props.dataKey);
                    }
                }, 50);

                // containerElement.animate({
                //     scrollTop: topPos
                // });
                // console.log(containerElement.scrollTop);
            }
        }
    }

    generateTableRowId = (index) => {
        return this.state.tableId + '_row' + index;
    }

    render () {
        const { classes, theme } = this.props;
        const { data } = this.props;
        const { tableId } = this.state;

        return (
            <div className={classes.root}>
                {/* Toolbar */}
                <Toolbar className={classes.toolbar}>
                    <div className={classes.title}>
                        <Typography variant="title">
                            {this.props.title}
                        </Typography>
                    </div>
                </Toolbar>

                <div
                    id={tableId}
                    className={classes.tablePaper}>
                    <CSSTransitionGroup
                        component="div"
                        transitionName="example"
                        transitionEnterTimeout={700}
                        transitionLeaveTimeout={700}>
                        {data.map((row, index) => {
                            return (
                                <div
                                    id={this.generateTableRowId(index)}
                                    key={index}
                                    className={classes.messageContainer}>
                                    <Avatar
                                        alt={row.sender.name}
                                        src={row.sender.imgUrl}
                                        className={classes.avatar} />
                                    <div className={classes.messageBody}>
                                        <span className={classes.name}>
                                            {row.sender.name}
                                        </span>
                                        <span className={classes.message}>
                                            {row.message}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </CSSTransitionGroup>
                </div>
            </div>
        )
    }
}

RealtimeMessageTable.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RealtimeMessageTable);
