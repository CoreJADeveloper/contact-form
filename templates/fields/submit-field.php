<div class='<?php echo $field_object->built_classes ?> ng-submit-button-position'>
    <input type='submit'
           class='<?php echo esc_attr($field_object->classes) ?> ng-contact-form-submit-button'
           value='<?php echo esc_html($field_object->label) ?>'/>
    <div class="ng-confirmation-message"></div>
</div>
<?php
if ($field_object->position_checked > 0) {
    $button_position = '.ng-submit-button-position {width: 100%; padding: 10px 0;}
            .ng-contact-form-submit-button{float: right;}
            ';

    wp_add_inline_style('angcf-inline-style', $button_position);
}

$button_space = '.ng-contact-form-submit-button{margin-bottom: 10px;}
            ';

wp_add_inline_style('angcf-inline-style', $button_space);