<?php
namespace CONTACTFORM;
/**
 * Plugin Name: WordPress Contact Form
 * Author: Tauhidul Alam
 * Description: A contact form :(
 */


class ContactForm{

    protected static $_instance = null;

    public static function instance(){
        if(is_null(self::$_instance)){
            self::$_instance = new self;
            self::_initialize_actions();
        }

        return self::$_instance;
    }

    private function _initialize_actions(){
        $this->_enqueue_admin_scripts();
    }

    private function _enqueue_admin_scripts(){

    }

}

function contact_form(){
    return ContactForm::instance();
}

$GLOBALS['contact_form'] = contact_form();


