import React, { Component } from 'react';
import { Icon, message, Modal } from 'antd';
import Tag from 'components/tag';
import moment from 'moment';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import toolbar from 'constants/toolbar';
import AnswerItem from 'components/answer-item';
import Img from 'components/img';
import utils from 'lib/utils';
import strings from 'strings';
import history from 'lib/history';
import { GET_QUESTION_ANSWER, POST_ANSWER } from 'constants/url';
import { articleType } from 'constants/articleType';
import { DEFAULT_AVATAR } from 'constants/default';
import Nav from './nav';
import '../../scss/react-draft-wysiwyg.scss';
import '../../scss/questionPage.scss';

const { questionInfo } = window;
const showCount = 3;

class QuestionPage extends Component {
  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty(),
      showAllAnswer: false,
      answerList: []
    };
    utils.bindMethods(['changeEditorState', 'showAllAnswer', 'postAnswer'], this);
  }
  componentDidMount() {
    if(window.userInfo.hasLogin) {
      history.saveHistory(window.userInfo.uid, {
        title: questionInfo.title,
        href: `/question/${questionInfo.qid}`,
        type: articleType.Question,
        id: questionInfo.qid
      });
    }
    this.getAnswerList();
    utils.logEvent('PV_Question', {
      QuestionId: questionInfo.qid
    });
  }
  changeEditorState(editorState) {
    this.setState({ editorState });
  }
  showAllAnswer() {
    this.setState({
      showAllAnswer: true
    });
  }
  getAnswerList() {
    utils.logEvent('GET_AnswerList_Start');
    utils.fetch(GET_QUESTION_ANSWER, {
      data: {
        qid: questionInfo.qid
      }
    }).then((res) => {
      if(res.type === 0) {
        utils.logEvent('GET_AnswerList_Success');
        const showbtn = res.data.answerList.length < showCount;
        this.setState({
          answerList: res.data.answerList,
          showAllAnswer: showbtn
        });
      } else {
        utils.logEvent('GET_AnswerList_Fail');
        message.error(res.data.msg || strings.common_server_error);
      }
    }, () => {
      utils.logEvent('GET_AnswerList_Fail_Server_Error');
      message.error(strings.common_server_error);
    });
  }
  postAnswer() {
    const { editorState } = this.state;
    Modal.confirm({
      title: strings.question_post_answer,
      okText: strings.common_confirm,
      cancenText: strings.common_cancel,
      onOk: () => {
        utils.logEvent('Start_Post_Answer');
        utils.fetch(POST_ANSWER, {
          method: 'POST',
          data: {
            time: Date.now().toString(),
            uid: window.userInfo.uid,
            qid: questionInfo.qid,
            content: JSON.stringify(convertToRaw(editorState.getCurrentContent()))
          }
        }).then((res) => {
          if(res.type === 0) {
            utils.logEvent('Post_Answer_Success');
            Modal.success({
              title: strings.question_post_success,
              onOk: () => {
                window.location.reload();
              }
            });
          } else {
            utils.logEvent('Post_Answer_Success_Fail');
            message.error(res.data.msg || strings.common_server_error);
          }
        }, () => {
          utils.logEvent('Post_Answer_Fail_Server_Error');
          message.error(strings.common_server_error);
        });
      }
    });
  }
  render() {
    const { editorState, showAllAnswer, answerList } = this.state;
    const hasAnswers = answerList.length !== 0;
    const showAnswer = showAllAnswer ?
      answerList : answerList.length > showCount ?
        answerList.slice(0, showCount) : answerList;
    const restNum = answerList.length - showCount;
    moment.locale('zh-cn');
    return (
      <div className="question-page-container">
        <Nav />
        <div className="top-container card-container">
          <div className="top-content">
            <div className="author-container">
              <Img href={`/profile/${questionInfo.uid}`} src={questionInfo.avatar || DEFAULT_AVATAR} />
              <a className="author-name" href={`/profile/${questionInfo.uid}`}>{questionInfo.author}</a>
              <span className="time">{utils.formatString(strings.question_time, moment(+questionInfo.time).format('YYYY-MM-DD'))}</span>
            </div>
            <h3 className="question-title">{questionInfo.title}</h3>
            <div className="tag">
              <Tag color="#0084ff">{questionInfo.tags}</Tag>
            </div>
            <p>{questionInfo.content}</p>
          </div>
          <div className="post-answer">
            <a href="#editor">
              <div className="btn">
                <Icon type="edit" />&nbsp;
                {strings.question_button}
              </div>
            </a>
          </div>
        </div>
        <div className="answer-list">
          {hasAnswers && showAnswer
            .map((item, index) => <AnswerItem {...item} key={index} />)}
          {!hasAnswers &&
            <div className="no-answer">
              <Icon type="exception" />&nbsp;
              {strings.question_no_answer}
            </div>}
        </div>
        {!showAllAnswer && restNum > 0 &&
          <div className="show-more card-container" onClick={this.showAllAnswer}>{utils.formatString(strings.question_click_to_view, restNum)}</div>}
        <div className="write-answer card-container" id="editor">
          <Editor
            editorState={editorState}
            wrapperClassName="editor-wrapper"
            editorClassName="editor"
            onEditorStateChange={this.changeEditorState}
            toolbar={toolbar}
            localization={{ locale: 'zh' }}
            placeholder={strings.question_write_placeholer}
          />
          <div className="btn" onClick={this.postAnswer}>
            <Icon type="edit" />&nbsp;
            {strings.question_post_button}
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionPage;
