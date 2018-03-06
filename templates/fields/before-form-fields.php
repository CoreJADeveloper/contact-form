<div class="ng-contact-form-container">
    <?php

    if (isset($form_fields_settings->form_name) && !empty($form_fields_settings->form_name)) {
        ?>
        <h3>{$esc_html($form_fields_settings->form_name)}</h3>
        <?php
    }

    ?>
    <form action='#' method='post' class='{$form_fields_settings->form_css_classes} ng-contact-form-submit'>
